<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import {
		SEARCHABLE_ITEMS,
		ANTIDOTE_COMPONENT_COUNT,
		SCAN_PREFIX,
		searchItems,
		findItemByName,
		parseScanCode,
		findItemById
	} from '$lib/toto/escape-game-config';

	const dispatch = createEventDispatcher();

	export let token;
	// Index des épreuves déjà validées en base : permet de reprendre la synthèse
	// au bon endroit après un rechargement (composants déjà trouvés pré-remplis).
	export let validatedTrials = [];
	// Nombre d'erreurs déjà enregistrées en base (pour persister après refresh)
	export let initialErrorCount = 0;

	const SLOT_COUNT = ANTIDOTE_COMPONENT_COUNT;

	// Encarts de la formule : null = vide, sinon { id, name, image }
	let slots = Array(SLOT_COUNT).fill(null);
	let foundIds = new Set(); // ids des composants déjà trouvés

	// Barre de recherche
	let searchQuery = '';
	let suggestions = [];
	let showSuggestions = false;
	let searchError = '';
	let searchInput;
	let highlightedIndex = -1; // suggestion surlignée (navigation clavier)
	let suggestionEls = []; // refs DOM des suggestions (scroll into view)

	// Feedback de validation directe par scan QR (douchette), sans modale
	let scanFeedback = null; // { type: 'success' | 'error' | 'info', message }
	let scanFeedbackTimeout = null;
	let scanDebounceTimeout = null; // auto-validation quand la saisie scannée se stabilise

	// Pop-up dédiée au scan QR (ouverte au raccourci clavier F2 ou via le bouton)
	let scanModalOpen = false;
	let scanModalValue = '';
	let scanModalInput;
	let scanModalFeedback = null; // { type, message }
	let scanModalFeedbackTimeout = null;
	let scanModalDebounce = null;

	// Modale produit
	let modalItem = null; // SearchableItem affiché dans la modale
	let modalFeedback = null; // { type: 'success' | 'error' | 'info', message }
	let isValidating = false;
	
	// Affichage d'erreur avec pénalité (animation fancy)
	let errorPenaltyDisplay = null; // { message: string, show: boolean }
	let errorPenaltyTimeout = null;

	// Synchronisation API + fin d'étape
	let syncedTrials = new Set();
	let isComplete = false;
	let isDefeated = false; // true when game over (population 0 or timer expired)

	// Timer en direct de la salle "salle-3" (flux SSE public)
	const TIMER_ROOM_ID = 'salle-3';
	let roomTime = '--:--';
	let timerStatus = 'IDLE';
	let timerEndTimestamp = null;
	let lastRemainingMs = 0;
	let totalMs = 0; // durée totale estimée (max de temps restant observé)
	let timerEventSource = null;
	let timerInterval = null;
	let timerReconnectTimeout = null;

	// Compteur d'êtres humains vivants : décroît linéairement avec le temps
	const START_POPULATION = 5_000_000_000;
	const LOSS_PER_SECOND = 1_388_888; // ~5 milliards / 3600 secondes
	const ERROR_PENALTY = 50_000_000; // 50 millions par erreur
	
	let population = START_POPULATION;
	let dbErrorCount = initialErrorCount; // Nombre d'erreurs stocké en base (initialisé depuis le serveur)

	$: populationDisplay = population.toLocaleString('fr-FR');
	$: populationPercent = Math.min(100, Math.max(0, (population / START_POPULATION) * 100));

	/**
	 * Calcul linéaire de la population :
	 * population = START - (temps_écoulé_secondes * LOSS_PER_SECOND) - (erreurs * ERROR_PENALTY)
	 * Note: Si le timer est en pause, on garde la population actuelle (pas de décroissance)
	 */
	function computePopulation(remainingMs) {
		if (totalMs <= 0) return START_POPULATION;
		// Si le timer est en pause, on garde la population gelée
		if (timerStatus === 'PAUSED') {
			return population;
		}
		const elapsedMs = totalMs - remainingMs;
		const elapsedSeconds = Math.floor(elapsedMs / 1000);
		const timeLoss = elapsedSeconds * LOSS_PER_SECOND;
		const errorLoss = dbErrorCount * ERROR_PENALTY;
		const computed = START_POPULATION - timeLoss - errorLoss;
		return Math.max(0, Math.round(computed));
	}

	$: filledCount = slots.filter(Boolean).length;
	$: progressPercent = (filledCount / SLOT_COUNT) * 100;

	function formatTime(ms) {
		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	function updateRoomTimer() {
		let remaining;
		if (timerStatus === 'RUNNING' && timerEndTimestamp) {
			remaining = Math.max(0, timerEndTimestamp - Date.now());
			lastRemainingMs = remaining;
		} else {
			remaining = lastRemainingMs;
		}
		roomTime = formatTime(remaining);
		population = computePopulation(remaining);

		// Defeat detection: population reached 0 or timer expired
		if (!isDefeated && !isComplete) {
			if (population <= 0) {
				triggerDefeat('population');
			} else if (timerStatus === 'RUNNING' && remaining <= 0) {
				triggerDefeat('time');
			}
		}
	}

	function triggerDefeat(reason) {
		if (isDefeated || isComplete) return;
		isDefeated = true;
		const finalSurvivors = population.toString();
		const finalErrorCount = dbErrorCount;
		// Pause the timer on the server so GM dashboard reflects the end
		notifyGameEnd(reason);
		setTimeout(() => dispatch('defeat', { reason, survivors: finalSurvivors, errorCount: finalErrorCount }), 500);
	}

	function handleTimerState(event) {
		timerStatus = event.status;
		lastRemainingMs = event.remainingMs;
		// Utiliser la durée réelle du timer envoyée par le serveur
		if (event.durationMs) {
			totalMs = event.durationMs;
		} else {
			// Fallback : la plus grande valeur observée approxime la durée totale
			totalMs = Math.max(totalMs, event.remainingMs);
		}

		if (event.status === 'RUNNING' && event.endsAt) {
			timerEndTimestamp = new Date(event.endsAt).getTime();
		} else {
			timerEndTimestamp = null;
		}

		updateRoomTimer();
	}

	function setupTimerSSE() {
		if (!browser) return;

		if (timerEventSource) timerEventSource.close();
		if (timerInterval) clearInterval(timerInterval);

		timerEventSource = new EventSource(`/api/rooms/${TIMER_ROOM_ID}/events`);

		timerEventSource.addEventListener('timer_state', (e) => {
			try {
				handleTimerState(JSON.parse(e.data));
			} catch (err) {
				console.error('Timer state parse error:', err);
			}
		});

		// Écouter les mises à jour de population (erreurs enregistrées en base)
		timerEventSource.addEventListener('population_update', (e) => {
			try {
				const data = JSON.parse(e.data);
				if (typeof data.errorCount === 'number') {
					dbErrorCount = data.errorCount;
					updateRoomTimer();
				}
			} catch (err) {
				console.error('Population update parse error:', err);
			}
		});

		timerEventSource.onerror = () => {
			// Reconnexion après un délai (ex: pas de run active sur salle-3)
			timerEventSource?.close();
			timerReconnectTimeout = setTimeout(() => {
				if (browser) setupTimerSSE();
			}, 5000);
		};

		updateRoomTimer();
		timerInterval = setInterval(updateRoomTimer, 250);
	}

	function onSearchInput() {
		searchError = '';
		highlightedIndex = -1;
		// Pendant un scan douchette, le texte préfixé ne matche aucun nom :
		// on n'affiche pas de suggestions (évite tout clignotement du menu).
		if (parseScanCode(searchQuery) !== null) {
			suggestions = [];
			showSuggestions = false;
			// La douchette tape vite puis s'arrête. Dès que la saisie se stabilise,
			// on valide automatiquement — sans dépendre d'un suffixe Entrée
			// (toutes les douchettes n'en envoient pas).
			if (scanDebounceTimeout) clearTimeout(scanDebounceTimeout);
			scanDebounceTimeout = setTimeout(() => submitSearch(), 120);
			return;
		}
		suggestions = searchItems(searchQuery);
		showSuggestions = suggestions.length > 0;
	}

	function setScanFeedback(type, message) {
		scanFeedback = { type, message };
		if (scanFeedbackTimeout) clearTimeout(scanFeedbackTimeout);
		scanFeedbackTimeout = setTimeout(() => (scanFeedback = null), 4000);
	}

	// ----- Pop-up dédiée au scan QR -----

	function openScanModal() {
		if (isComplete || errorPenaltyDisplay) return;
		modalItem = null; // ferme une éventuelle fiche produit pour éviter l'empilement
		showSuggestions = false;
		scanModalOpen = true;
		scanModalValue = '';
		scanModalFeedback = null;
		setTimeout(() => scanModalInput?.focus(), 0);
	}

	function closeScanModal() {
		scanModalOpen = false;
		scanModalValue = '';
		if (scanModalDebounce) clearTimeout(scanModalDebounce);
		setTimeout(() => searchInput?.focus(), 0);
	}

	function setScanModalFeedback(type, message) {
		scanModalFeedback = { type, message };
		if (scanModalFeedbackTimeout) clearTimeout(scanModalFeedbackTimeout);
		scanModalFeedbackTimeout = setTimeout(() => (scanModalFeedback = null), 4000);
	}

	// Dans la pop-up, toute saisie est un scan : on accepte l'id, le nom,
	// ou une valeur préfixée VAIK17: (au cas où) — aucun préfixe requis.
	function findScannedItem(raw) {
		const code = parseScanCode(raw);
		const key = code !== null ? code : raw;
		return findItemById(key) || findItemByName(key);
	}

	function onScanModalInput() {
		// La douchette tape vite puis s'arrête : auto-validation à la stabilisation
		if (scanModalDebounce) clearTimeout(scanModalDebounce);
		scanModalDebounce = setTimeout(validateScanNow, 150);
	}

	async function validateScanNow() {
		if (scanModalDebounce) {
			clearTimeout(scanModalDebounce);
			scanModalDebounce = null;
		}

		if (errorPenaltyDisplay) return; // Block during penalty overlay

		const raw = scanModalValue.trim();
		if (!raw) return;

		const item = findScannedItem(raw);
		scanModalValue = ''; // prêt pour le scan suivant
		setTimeout(() => scanModalInput?.focus(), 0);

		if (!item) {
			setScanModalFeedback('error', `« ${raw} » non reconnu.`);
			return;
		}

		const result = await applyAnswer(item);
		if (result === 'success') {
			setScanModalFeedback('success', `${item.name} ajouté à la formule !`);
		} else if (result === 'duplicate') {
			setScanModalFeedback('info', `${item.name} a déjà été ajouté à la formule.`);
		} else {
			setScanModalFeedback('error', `${item.name} ne fait pas partie de la formule de l'antidote.`);
		}

		if (isComplete) {
			setTimeout(closeScanModal, 1200);
		}
	}

	function handleScanModalKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			validateScanNow();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			closeScanModal();
		}
	}

	function selectSuggestion(item) {
		searchQuery = item.name;
		showSuggestions = false;
		highlightedIndex = -1;
		openModal(item);
	}

	function scrollHighlightedIntoView() {
		setTimeout(() => suggestionEls[highlightedIndex]?.scrollIntoView({ block: 'nearest' }), 0);
	}

	async function submitSearch() {
		// Annule l'auto-validation en attente (ex: la touche Entrée a devancé le debounce)
		if (scanDebounceTimeout) {
			clearTimeout(scanDebounceTimeout);
			scanDebounceTimeout = null;
		}

		if (isComplete || errorPenaltyDisplay) return;
		if (!searchQuery.trim()) return;

		// Cas scan douchette : validation directe, sans modale
		const code = parseScanCode(searchQuery);
		if (code !== null) {
			const item = findItemById(code);
			searchQuery = '';
			showSuggestions = false;
			searchError = '';

			if (!item) {
				setScanFeedback('error', 'Code QR non reconnu.');
				return;
			}

			const result = await applyAnswer(item);
			if (result === 'success') {
				setScanFeedback('success', `${item.name} ajouté à la formule !`);
			} else if (result === 'duplicate') {
				setScanFeedback('info', `${item.name} a déjà été ajouté à la formule.`);
			} else {
				setScanFeedback('error', `${item.name} ne fait pas partie de la formule de l'antidote.`);
			}
			return;
		}

		// Saisie manuelle : correspondance exacte en priorité, sinon meilleure suggestion
		const exact = findItemByName(searchQuery);
		const item = exact || searchItems(searchQuery)[0];

		if (!item) {
			searchError = `Aucun résultat pour « ${searchQuery.trim()} ».`;
			return;
		}

		showSuggestions = false;
		openModal(item);
	}

	function openModal(item) {
		modalItem = item;
		modalFeedback = null;
		isValidating = false;
	}

	function closeModal() {
		modalItem = null;
		modalFeedback = null;
		setTimeout(() => searchInput?.focus(), 0);
	}

	/**
	 * Envoie une erreur à l'API pour mettre à jour la population
	 */
	async function reportError() {
		try {
			const response = await fetch(`/api/gm/rooms/${TIMER_ROOM_ID}/population/update`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ errorIncrement: 1 })
			});
			
			if (response.ok) {
				const data = await response.json();
				dbErrorCount = data.errorCount || dbErrorCount + 1;
				// Force recalculation de la population
				updateRoomTimer();
			}
		} catch (err) {
			console.error('Failed to report error:', err);
		}
	}

	/**
	 * Cœur de validation partagé entre la modale et le scan douchette.
	 * Renvoie 'error' (leurre), 'duplicate' (déjà trouvé) ou 'success'.
	 * En cas de succès : remplit un encart, synchronise l'API et vérifie la fin.
	 */
	async function applyAnswer(item) {
		if (!item.isComponent) {
			await reportError();
			return 'error';
		}
		if (foundIds.has(item.id)) return 'duplicate';

		foundIds = new Set(foundIds).add(item.id);

		const emptyIndex = slots.findIndex((s) => s === null);
		if (emptyIndex !== -1) {
			slots[emptyIndex] = {
				id: item.id,
				name: item.name,
				image: item.image
			};
			slots = slots;
		}

		await syncTrial(item.trialIndex);
		checkComplete();
		return 'success';
	}

	async function validateModal() {
		if (!modalItem || isValidating || errorPenaltyDisplay) return;

		const item = modalItem;

	if (!item.isComponent) {
			// Fermer la modale immédiatement et vider la recherche
			// pour empêcher de re-soumettre le même composant après la pénalité
			closeModal();
			searchQuery = '';
			suggestions = [];
			showSuggestions = false;
			
			// Afficher l'erreur avec pénalité
			showErrorPenalty();
			
			// Appeler l'API pour enregistrer l'erreur
			await reportError();
			return;
		}

		if (foundIds.has(item.id)) {
			modalFeedback = {
				type: 'info',
				message: 'Ce composant a déjà été ajouté à la formule.'
			};
			return;
		}

		isValidating = true;
		await applyAnswer(item);

		modalFeedback = {
			type: 'success',
			message: `${item.name} ajouté à la formule !`
		};

		// Fermer la modale après un court délai et réinitialiser la recherche
		setTimeout(() => {
			searchQuery = '';
			suggestions = [];
			closeModal();
		}, 1200);
	}
	
	function showErrorPenalty() {
		errorPenaltyDisplay = {
			message: '-50 000 000',
			show: true
		};
		
		if (errorPenaltyTimeout) clearTimeout(errorPenaltyTimeout);
		errorPenaltyTimeout = setTimeout(() => {
			if (errorPenaltyDisplay) {
				errorPenaltyDisplay.show = false;
			}
			setTimeout(() => {
				errorPenaltyDisplay = null;
				// Re-focus the search input now that the penalty is cleared
				// (the input was disabled while errorPenaltyDisplay was set)
				setTimeout(() => searchInput?.focus(), 0);
			}, 800); // Temps pour l'animation de sortie
		}, 5000);
	}

	function checkComplete() {
		const count = slots.filter(Boolean).length;
		if (count >= SLOT_COUNT && !isComplete) {
			isComplete = true;
			// Fige le temps restant affiché à l'instant exact de la dernière validation
			const remainingTime = roomTime;
			const finalSurvivors = population.toString();
			const finalErrorCount = dbErrorCount;
			// Pause the timer on the server so GM dashboard reflects the end
			notifyGameEnd('complete');
			setTimeout(() => dispatch('complete', { remainingTime, survivors: finalSurvivors, errorCount: finalErrorCount }), 2000);
		}
	}

	/**
	 * Notifie le serveur que la partie est terminée (victoire ou défaite)
	 * afin de mettre en pause le timer côté GM.
	 */
	async function notifyGameEnd(reason) {
		try {
			await fetch('/api/escape-game/end-game', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, reason, survivors: population.toString(), errorCount: dbErrorCount })
			});
		} catch (err) {
			console.error('Failed to notify game end:', err);
		}
	}

	async function syncTrial(trialIndex) {
		if (trialIndex == null || syncedTrials.has(trialIndex)) return;

		try {
			const response = await fetch('/api/escape-game/validate-trial', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, trialIndex, validated: true })
			});

			if (response.ok) {
				syncedTrials.add(trialIndex);
			} else {
				console.error(`Failed to sync trial ${trialIndex}: HTTP ${response.status}`);
			}
		} catch (err) {
			console.error(`Error syncing trial ${trialIndex}:`, err);
		}
	}

	function handleSearchKeydown(event) {
		// Bloquer toute interaction pendant la pénalité d'erreur
		if (errorPenaltyDisplay) return;
		// Si la modale est ouverte, on laisse la fenêtre gérer Entrée/Échap
		if (modalItem) return;

		if (event.key === 'ArrowDown') {
			if (suggestions.length === 0) return;
			event.preventDefault();
			showSuggestions = true;
			highlightedIndex = (highlightedIndex + 1) % suggestions.length;
			scrollHighlightedIntoView();
		} else if (event.key === 'ArrowUp') {
			if (suggestions.length === 0) return;
			event.preventDefault();
			showSuggestions = true;
			highlightedIndex = highlightedIndex <= 0 ? suggestions.length - 1 : highlightedIndex - 1;
			scrollHighlightedIntoView();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			// Si une suggestion est surlignée, on l'ouvre ; sinon comportement normal
			if (showSuggestions && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
				selectSuggestion(suggestions[highlightedIndex]);
			} else {
				submitSearch();
			}
		} else if (event.key === 'Escape') {
			showSuggestions = false;
			highlightedIndex = -1;
		}
	}

	function handleWindowKeydown(event) {
		// Bloquer toute interaction clavier pendant la pénalité d'erreur
		if (errorPenaltyDisplay) return;

		// Raccourci d'ouverture de la pop-up de scan
		if (event.key === 'F2') {
			event.preventDefault();
			if (scanModalOpen) {
				closeScanModal();
			} else {
				openScanModal();
			}
			return;
		}

		// Pop-up de scan ouverte : les touches sont gérées par son propre input
		if (scanModalOpen) return;

		if (!modalItem) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			closeModal();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			validateModal();
		}
	}

	function hideSuggestionsSoon() {
		// Laisse le temps au clic sur une suggestion de s'enregistrer
		setTimeout(() => (showSuggestions = false), 150);
	}

	// Debug : pré-remplir tous les composants (à retirer en prod)
	function fillDebug() {
		for (const item of SEARCHABLE_ITEMS.filter((i) => i.isComponent)) {
			if (foundIds.has(item.id)) continue;
			foundIds = new Set(foundIds).add(item.id);
			const idx = slots.findIndex((s) => s === null);
			if (idx !== -1) {
				slots[idx] = { id: item.id, name: item.name, image: item.image };
			}
			syncTrial(item.trialIndex);
		}
		slots = slots;
		checkComplete();
	}

	// Restaure les composants déjà validés (reprise après rechargement).
	// Ne déclenche pas checkComplete : si tout était validé, la page afficherait
	// directement l'écran de victoire sans monter ce composant.
	function restoreProgress() {
		if (!validatedTrials || validatedTrials.length === 0) return;
		const validatedSet = new Set(validatedTrials);

		for (const item of SEARCHABLE_ITEMS) {
			if (!item.isComponent || !validatedSet.has(item.trialIndex)) continue;
			if (foundIds.has(item.id)) continue;

			foundIds = new Set(foundIds).add(item.id);
			const idx = slots.findIndex((s) => s === null);
			if (idx !== -1) {
				slots[idx] = { id: item.id, name: item.name, image: item.image };
			}
			syncedTrials.add(item.trialIndex);
		}
		slots = slots;
	}

	onMount(() => {
		restoreProgress();
		searchInput?.focus();
		setupTimerSSE();
	});

	onDestroy(() => {
		if (timerEventSource) timerEventSource.close();
		if (timerInterval) clearInterval(timerInterval);
		if (timerReconnectTimeout) clearTimeout(timerReconnectTimeout);
		if (scanFeedbackTimeout) clearTimeout(scanFeedbackTimeout);
		if (scanDebounceTimeout) clearTimeout(scanDebounceTimeout);
		if (scanModalDebounce) clearTimeout(scanModalDebounce);
		if (scanModalFeedbackTimeout) clearTimeout(scanModalFeedbackTimeout);
		if (errorPenaltyTimeout) clearTimeout(errorPenaltyTimeout);
	});
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<div class="antidote-stage">
	<div class="antidote-layout">
		<!-- Main Content -->
		<div class="main-content">
			<!-- Breadcrumb -->
			<div class="breadcrumb">
				&gt; LAB-OMEGA / SYNTHÈSE EN COURS
			</div>

			<!-- Header -->
			<div class="stage-header">
				<h1 class="stage-title">FORMULE D'ANTIDOTE</h1>
				<p class="stage-description">
					Le système est de nouveau opérationnel. Reconstituez la formule de l'antidote
					du virus Vaïk-17 en identifiant les {SLOT_COUNT} composants moléculaires nécessaires.
					<strong>Recherchez un composant, puis validez votre choix.</strong>
				</p>
			</div>

			<!-- Progress -->
			<div class="progress-section">
				<div class="progress-header">
					<span class="progress-label">PROGRESSION DE LA SYNTHÈSE</span>
					<span class="progress-count">{filledCount}/{SLOT_COUNT} composants</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercent}%"></div>
				</div>
			</div>

			<!-- Search -->
			<div class="search-section">
				<div class="search-box">
					<span class="search-icon">🔍</span>
					<input
						bind:this={searchInput}
						bind:value={searchQuery}
						on:input={onSearchInput}
						on:keydown={handleSearchKeydown}
						on:focus={onSearchInput}
						on:blur={hideSuggestionsSoon}
						class="search-input"
						type="text"
						placeholder="Rechercher un composant… (3 lettres minimum)"
						autocomplete="off"
						spellcheck="false"
				disabled={isComplete || !!errorPenaltyDisplay}
			/>
			<button
				class="search-btn"
				on:click={submitSearch}
				disabled={isComplete || !!errorPenaltyDisplay || !searchQuery.trim()}
					>
						Valider
					</button>

					{#if showSuggestions}
						<ul class="suggestions">
							{#each suggestions as item, i (item.id)}
								<li>
									<button
										class="suggestion"
										class:active={i === highlightedIndex}
										bind:this={suggestionEls[i]}
										on:mousedown|preventDefault={() => selectSuggestion(item)}
										on:mouseenter={() => (highlightedIndex = i)}
									>
										<span class="suggestion-icon">🔎</span>
										{item.name}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div class="search-tools">
				<button class="scan-open-btn" on:click={openScanModal} disabled={isComplete || !!errorPenaltyDisplay}>
						📷 Scanner un QR code <kbd>F2</kbd>
					</button>
				</div>
				{#if searchError}
					<p class="search-error">⚠ {searchError}</p>
				{/if}
				{#if scanFeedback}
					<p class="scan-feedback scan-feedback-{scanFeedback.type}">{scanFeedback.message}</p>
				{/if}
			</div>

			<!-- Formula Cards -->
			<div class="formula-card">
				<div class="cards-grid">
					{#each slots as slot, index}
						<div class="component-card" class:filled={slot}>
							{#if slot}
								<div class="card-thumb">
									{#if slot.image}
										<img src={slot.image} alt={slot.name} />
									{:else}
										<span class="card-thumb-placeholder">🧪</span>
									{/if}
								</div>
								<span class="card-name">{slot.name}</span>
								<span class="card-check">✓</span>
							{:else}
								<span class="card-index">{(index + 1).toString().padStart(2, '0')}</span>
								<span class="card-empty-label">Composant manquant</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Info Panel -->
			<div class="info-panel">
				<span class="info-icon">ℹ</span>
				<div class="info-content">
					<p class="info-title">Comment procéder</p>
					<p class="info-text">
						Tapez le nom d'un composant dans la barre de recherche. Après
						<strong>3 lettres</strong>, des suggestions apparaissent. Sélectionnez-en une
						ou validez votre saisie pour ouvrir sa fiche, puis confirmez avec
						<strong>Entrée</strong>. Pour scanner un QR code, ouvrez le scanner avec
						<strong>F2</strong> : la validation y est automatique.
					</p>
				</div>
			</div>

			<!-- Warning Panel -->
			<div class="warning-panel">
				<span class="warning-icon">⚠</span>
				<div class="warning-content">
					<p class="warning-title">Contrainte de compatibilité moléculaire</p>
					<p class="warning-text">
						Les composants doivent être identifiés avec précision. Seuls les éléments
						faisant réellement partie de l'antidote pourront être intégrés à la formule.
					</p>
				</div>
			</div>

			<!-- Messages -->
			{#if isComplete}
				<div class="message message-success">
					<span class="message-icon">✓</span>
					<p>Antidote synthétisé avec succès ! Transfert vers l'analyse finale...</p>
				</div>
			{/if}


	<!-- Debug button (hidden by default) -->
	<button
		on:click={fillDebug}
		class="btn-debug"
		title="Debug: pré-remplir les réponses"
	>
		🔧
	</button>
		</div>

		<!-- Sidebar Monitoring -->
		<aside class="monitoring-sidebar">
			<div class="sidebar-header">
				<span class="sidebar-status">ÉTAT CRITIQUE</span>
			</div>

			<div class="monitoring-metrics">
				<div class="metric">
					<span class="metric-label">Êtres humains vivants</span>
					<span class="metric-value metric-danger metric-population">{populationDisplay}</span>
					<div class="metric-bar">
						<div class="metric-fill metric-fill-danger" style="width: {populationPercent}%"></div>
					</div>
				</div>

				<div class="metric">
					<span class="metric-label">Intégrité système</span>
					<span class="metric-value metric-warning">34%</span>
					<div class="metric-bar">
						<div class="metric-fill metric-fill-warning" style="width: 34%"></div>
					</div>
				</div>

				<div class="metric">
					<span class="metric-label">Temps restant</span>
					<span class="metric-value" class:metric-cyan={timerStatus !== 'PAUSED'} class:metric-warning={timerStatus === 'PAUSED'}>{roomTime}</span>
				</div>

				<div class="metric">
					<span class="metric-label">Statut protocole</span>
					<span class="metric-value metric-success">EN COURS</span>
				</div>
			</div>

			<div class="sidebar-graph">
				<svg viewBox="0 0 200 60" class="mini-graph">
					<polyline
						points="0,50 20,45 40,48 60,40 80,42 100,35 120,38 140,30 160,32 180,28 200,25"
						fill="none"
						stroke="rgba(0, 229, 255, 0.3)"
						stroke-width="1"
					/>
					<circle cx="200" cy="25" r="2" fill="var(--accent-cyan)" />
				</svg>
			</div>
		</aside>
	</div>
</div>

<!-- Error Penalty Display (full-page overlay) -->
{#if errorPenaltyDisplay}
	<div class="error-penalty-fullpage" class:show={errorPenaltyDisplay.show}>
		<div class="error-penalty-content">
			<div class="error-penalty-number">{errorPenaltyDisplay.message}</div>
			<div class="error-penalty-label">humains sur Terre</div>
			<div class="error-penalty-sublabel">PÉNALITÉ D'ERREUR</div>
		</div>
	</div>
{/if}

<!-- Modale produit -->
{#if modalItem}
	<div class="modal-overlay" on:click={closeModal} role="presentation">
		<div class="modal" on:click|stopPropagation role="dialog" aria-modal="true">
			<button class="modal-close" on:click={closeModal} aria-label="Fermer">✕</button>

			<div class="modal-image">
				{#if modalItem.image}
					<img src={modalItem.image} alt={modalItem.name} />
				{:else}
					<span class="modal-image-placeholder">🧪</span>
				{/if}
			</div>

			<h3 class="modal-title">{modalItem.name}</h3>
			<p class="modal-description">{modalItem.description}</p>

			{#if modalFeedback}
				<div class="modal-feedback modal-feedback-{modalFeedback.type}">
					{modalFeedback.message}
				</div>
			{/if}

			<div class="modal-actions">
				<button class="modal-btn modal-btn-secondary" on:click={closeModal}>
					Annuler <kbd>Échap</kbd>
				</button>
				<button
					class="modal-btn modal-btn-primary"
					on:click={validateModal}
					disabled={isValidating}
				>
					Valider <kbd>Entrée</kbd>
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Pop-up de scan QR (douchette) : validation automatique -->
{#if scanModalOpen}
	<div class="modal-overlay" on:click={closeScanModal} role="presentation">
		<div class="modal scan-modal" on:click|stopPropagation role="dialog" aria-modal="true">
			<button class="modal-close" on:click={closeScanModal} aria-label="Fermer">✕</button>

			<div class="scan-modal-icon">📷</div>
			<h3 class="modal-title">Scanner un composant</h3>
			<p class="modal-description">
				Scannez le QR code d'un élément avec la douchette. La validation est
				automatique.
			</p>

			<input
				bind:this={scanModalInput}
				bind:value={scanModalValue}
				on:input={onScanModalInput}
				on:keydown={handleScanModalKeydown}
				class="scan-modal-input"
				type="text"
				placeholder="En attente du scan…"
				autocomplete="off"
				spellcheck="false"
			/>

			{#if scanModalFeedback}
				<div class="modal-feedback modal-feedback-{scanModalFeedback.type}">
					{scanModalFeedback.message}
				</div>
			{/if}

			<div class="modal-actions">
				<button class="modal-btn modal-btn-secondary" on:click={closeScanModal}>
					Fermer <kbd>Échap</kbd>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.antidote-stage {
		width: 100%;
	}

	.antidote-layout {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: var(--spacing-2xl);
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Main Content */
	.main-content {
		min-width: 0;
	}

	/* Breadcrumb */
	.breadcrumb {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-muted);
		margin-bottom: var(--spacing-xl);
	}

	/* Stage Header */
	.stage-header {
		margin-bottom: var(--spacing-2xl);
	}

	.stage-title {
		font-size: 56px;
		font-weight: 700;
		color: var(--accent-green);
		margin: 0 0 var(--spacing-lg) 0;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.stage-description {
		max-width: 700px;
		font-size: 15px;
		line-height: 1.7;
		color: var(--text-secondary);
		margin: 0;
	}

	.stage-description strong {
		color: var(--accent-cyan);
	}

	/* Progress Section */
	.progress-section {
		margin-bottom: var(--spacing-xl);
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-sm);
	}

	.progress-label {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		font-weight: 600;
	}

	.progress-count {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--accent-cyan);
		font-weight: 600;
	}

	.progress-bar {
		height: 6px;
		background: var(--bg-panel);
		border-radius: 3px;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-cyan), var(--accent-green));
		transition: width 0.3s ease;
	}

	/* Search */
	.search-section {
		margin-bottom: var(--spacing-xl);
	}

	.search-box {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		padding: 8px 8px 8px 16px;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.search-box:focus-within {
		border-color: var(--accent-cyan);
		box-shadow: 0 0 0 3px var(--cyan-soft);
	}

	.search-icon {
		font-size: 16px;
		opacity: 0.7;
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		min-width: 0;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-primary);
		font-size: 15px;
		font-family: var(--font-ui);
		padding: 6px 0;
	}

	.search-input::placeholder {
		color: var(--text-muted);
	}

	.search-btn {
		flex-shrink: 0;
		padding: 10px 20px;
		background: var(--accent-cyan);
		color: #020617;
		border: none;
		border-radius: var(--radius);
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: background 0.2s ease, opacity 0.2s ease;
	}

	.search-btn:hover:not(:disabled) {
		background: #5cefff;
	}

	.search-btn:disabled {
		background: var(--bg-panel-light);
		color: var(--text-muted);
		cursor: not-allowed;
	}

	/* Suggestions */
	.suggestions {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		right: 0;
		z-index: 50;
		margin: 0;
		padding: 6px;
		list-style: none;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
		max-height: 280px;
		overflow-y: auto;
	}

	.suggestion {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: 100%;
		text-align: left;
		padding: 10px 12px;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: var(--text-primary);
		font-size: 14px;
		font-family: var(--font-ui);
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.suggestion:hover,
	.suggestion.active {
		background: var(--cyan-soft);
		color: var(--accent-cyan);
	}

	.suggestion-icon {
		font-size: 12px;
		opacity: 0.6;
	}

	.search-error {
		margin: var(--spacing-sm) 0 0 0;
		font-size: 13px;
		color: var(--accent-red);
	}

	/* Feedback de validation par scan QR (douchette) */
	.scan-feedback {
		margin: var(--spacing-sm) 0 0 0;
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius);
		font-size: 14px;
		font-weight: 500;
		border: 1px solid;
	}

	.scan-feedback-success {
		background: var(--green-soft);
		border-color: rgba(0, 255, 163, 0.3);
		color: var(--accent-green);
		animation: successPulse 0.6s ease-out;
	}

	.scan-feedback-error {
		background: var(--red-soft);
		border-color: rgba(255, 77, 77, 0.3);
		color: var(--accent-red);
		animation: errorShake 0.4s ease-out;
	}

	.scan-feedback-info {
		background: var(--cyan-soft);
		border-color: rgba(0, 229, 255, 0.3);
		color: var(--accent-cyan);
	}

	/* Bouton d'ouverture du scanner */
	.search-tools {
		margin-top: var(--spacing-sm);
		display: flex;
		justify-content: flex-end;
	}

	.scan-open-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		color: var(--text-secondary);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.scan-open-btn:hover:not(:disabled) {
		border-color: var(--accent-cyan);
		color: var(--accent-cyan);
	}

	.scan-open-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.scan-open-btn kbd {
		font-family: var(--font-mono);
		font-size: 10px;
		padding: 2px 5px;
		border-radius: 3px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
	}

	/* Pop-up de scan */
	.scan-modal {
		text-align: center;
	}

	.scan-modal-icon {
		font-size: 56px;
		margin-bottom: var(--spacing-sm);
	}

	.scan-modal-input {
		width: 100%;
		margin: var(--spacing-lg) 0;
		padding: 14px 16px;
		background: var(--bg-panel);
		border: 2px solid var(--accent-cyan);
		border-radius: var(--radius);
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 16px;
		text-align: center;
		outline: none;
		box-shadow: 0 0 0 3px var(--cyan-soft);
	}

	.scan-modal-input::placeholder {
		color: var(--text-muted);
	}

	/* Formula Card */
	.formula-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		padding: var(--spacing-2xl);
		margin-bottom: var(--spacing-xl);
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-lg);
	}

	.component-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		min-height: 72px;
		padding: var(--spacing-md);
		background: var(--bg-panel);
		border: 1px dashed var(--border-color);
		border-radius: var(--radius);
		transition: all 0.3s ease;
	}

	.component-card.filled {
		border-style: solid;
		border-color: var(--accent-green);
		background: rgba(0, 255, 163, 0.05);
		animation: successPulse 0.6s ease-out;
	}

	.card-index {
		font-family: var(--font-mono);
		font-size: 20px;
		font-weight: 700;
		color: var(--text-muted);
		width: 32px;
		text-align: center;
		flex-shrink: 0;
	}

	.card-empty-label {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.card-thumb {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		overflow: hidden;
	}

	.card-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-thumb-placeholder {
		font-size: 22px;
	}

	.card-name {
		flex: 1;
		font-size: 15px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.card-check {
		flex-shrink: 0;
		color: var(--accent-green);
		font-size: 18px;
		font-weight: 700;
	}

	/* Animations */
	@keyframes successPulse {
		0% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgba(0, 255, 163, 0.7);
		}
		50% {
			transform: scale(1.02);
			box-shadow: 0 0 0 8px rgba(0, 255, 163, 0);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 0 0 rgba(0, 255, 163, 0);
		}
	}

	@keyframes errorShake {
		0%, 100% {
			transform: translateX(0);
		}
		10%, 30%, 50%, 70%, 90% {
			transform: translateX(-4px);
		}
		20%, 40%, 60%, 80% {
			transform: translateX(4px);
		}
	}

	/* Info Panel */
	.info-panel {
		display: flex;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background: rgba(0, 229, 255, 0.08);
		border: 1px solid rgba(0, 229, 255, 0.2);
		border-left: 3px solid var(--accent-cyan);
		border-radius: var(--radius);
		margin-bottom: var(--spacing-lg);
	}

	.info-icon {
		font-size: 20px;
		color: var(--accent-cyan);
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-cyan);
		margin: 0 0 var(--spacing-xs) 0;
	}

	.info-text {
		font-size: 13px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0;
	}

	.info-text strong {
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 12px;
		background: var(--bg-panel);
		padding: 2px 6px;
		border-radius: 3px;
		border: 1px solid var(--border-color);
	}

	/* Warning Panel */
	.warning-panel {
		display: flex;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background: rgba(255, 165, 0, 0.08);
		border: 1px solid rgba(255, 165, 0, 0.2);
		border-left: 3px solid var(--accent-orange);
		border-radius: var(--radius);
		margin-bottom: var(--spacing-lg);
	}

	.warning-icon {
		font-size: 20px;
		color: var(--accent-orange);
	}

	.warning-content {
		flex: 1;
	}

	.warning-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-orange);
		margin: 0 0 var(--spacing-xs) 0;
	}

	.warning-text {
		font-size: 13px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Messages */
	.message {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md) var(--spacing-lg);
		border-radius: var(--radius);
		font-size: 14px;
		margin-bottom: var(--spacing-lg);
		border: 1px solid;
	}

	.message-success {
		background: var(--green-soft);
		border-color: rgba(0, 255, 163, 0.3);
		color: var(--accent-green);
	}

	.message-icon {
		font-size: 18px;
	}

	.message p {
		margin: 0;
	}

	/* Debug Button */
	.btn-debug {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 40px;
		height: 40px;
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: 50%;
		font-size: 16px;
		cursor: pointer;
		opacity: 0.3;
		transition: opacity 0.2s;
	}

	.btn-debug:hover {
		opacity: 1;
	}

	/* Modale */
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-lg);
		background: rgba(2, 6, 23, 0.8);
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		position: relative;
		width: 100%;
		max-width: 440px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		padding: var(--spacing-2xl);
		box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
		animation: modalIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes modalIn {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-close {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 32px;
		height: 32px;
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: 50%;
		color: var(--text-secondary);
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.modal-close:hover {
		color: var(--accent-red);
		border-color: var(--accent-red);
	}

	.modal-image {
		width: 100%;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		overflow: hidden;
		margin-bottom: var(--spacing-lg);
	}

	.modal-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-image-placeholder {
		font-size: 64px;
		opacity: 0.5;
	}

	.modal-title {
		font-size: 24px;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 var(--spacing-sm) 0;
	}

	.modal-description {
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0 0 var(--spacing-lg) 0;
	}

	.modal-feedback {
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius);
		font-size: 14px;
		font-weight: 500;
		margin-bottom: var(--spacing-lg);
		border: 1px solid;
		animation: errorShake 0.4s ease-out;
	}

	.modal-feedback-success {
		background: var(--green-soft);
		border-color: rgba(0, 255, 163, 0.3);
		color: var(--accent-green);
		animation: successPulse 0.6s ease-out;
	}

	.modal-feedback-error {
		background: var(--red-soft);
		border-color: rgba(255, 77, 77, 0.3);
		color: var(--accent-red);
	}

	.modal-feedback-info {
		background: var(--cyan-soft);
		border-color: rgba(0, 229, 255, 0.3);
		color: var(--accent-cyan);
		animation: none;
	}

	.modal-actions {
		display: flex;
		gap: var(--spacing-sm);
		justify-content: flex-end;
	}

	.modal-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		border-radius: var(--radius);
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid var(--border-color);
		transition: all 0.2s ease;
	}

	.modal-btn kbd {
		font-family: var(--font-mono);
		font-size: 10px;
		padding: 2px 5px;
		border-radius: 3px;
		background: rgba(0, 0, 0, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.modal-btn-secondary {
		background: var(--bg-panel);
		color: var(--text-secondary);
	}

	.modal-btn-secondary:hover {
		color: var(--text-primary);
	}

	.modal-btn-primary {
		background: var(--accent-cyan);
		color: #020617;
		border-color: var(--accent-cyan);
	}

	.modal-btn-primary:hover:not(:disabled) {
		background: #5cefff;
	}

	.modal-btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Monitoring Sidebar */
	.monitoring-sidebar {
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		padding: var(--spacing-xl);
		height: fit-content;
		position: sticky;
		top: var(--spacing-xl);
	}

	.sidebar-header {
		margin-bottom: var(--spacing-xl);
	}

	.sidebar-status {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent-red);
		padding: 6px 12px;
		background: var(--red-soft);
		border: 1px solid rgba(255, 77, 77, 0.3);
		border-radius: 4px;
		font-weight: 600;
	}

	.monitoring-metrics {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		margin-bottom: var(--spacing-2xl);
	}

	.metric {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.metric-label {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		font-weight: 600;
	}

	.metric-value {
		font-family: var(--font-mono);
		font-size: 24px;
		font-weight: 700;
		line-height: 1;
	}

	.metric-danger {
		color: var(--accent-red);
	}

	.metric-population {
		font-size: 20px;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.01em;
	}

	.metric-warning {
		color: var(--accent-orange);
	}

	.metric-cyan {
		color: var(--accent-cyan);
	}

	.metric-success {
		color: var(--accent-green);
	}

	.metric-bar {
		height: 4px;
		background: var(--bg-panel);
		border-radius: 2px;
		overflow: hidden;
	}

	.metric-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.metric-fill-danger {
		background: var(--accent-red);
	}

	.metric-fill-warning {
		background: var(--accent-orange);
	}

	.sidebar-graph {
		padding: var(--spacing-md);
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
	}

	.mini-graph {
		width: 100%;
		height: auto;
	}

	/* Responsive */
	@media (max-width: 1200px) {
		.antidote-layout {
			grid-template-columns: 1fr 280px;
			gap: var(--spacing-xl);
		}

		.cards-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 1024px) {
		.antidote-layout {
			grid-template-columns: 1fr;
		}

		.monitoring-sidebar {
			position: relative;
			top: 0;
		}
	}

	/* Full-page Error Penalty Overlay */
	.error-penalty-fullpage {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(10, 0, 0, 0.95);
		backdrop-filter: blur(8px);
		opacity: 0;
		transition: opacity 0.6s ease;
		pointer-events: none;
	}

	.error-penalty-fullpage.show {
		opacity: 1;
		pointer-events: auto;
	}

	.error-penalty-content {
		text-align: center;
		animation: penaltyAppear 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.error-penalty-number {
		font-family: var(--font-mono);
		font-size: clamp(4rem, 12vw, 10rem);
		font-weight: 900;
		color: var(--accent-red);
		line-height: 1;
		text-shadow:
			0 0 40px rgba(255, 77, 77, 0.6),
			0 0 80px rgba(255, 77, 77, 0.3),
			0 0 120px rgba(255, 77, 77, 0.15);
		animation: penaltyPulse 1.5s ease-in-out infinite;
	}

	.error-penalty-label {
		font-family: var(--font-ui);
		font-size: clamp(1.2rem, 3vw, 2rem);
		font-weight: 600;
		color: var(--text-primary);
		margin-top: 1rem;
		letter-spacing: 0.02em;
	}

	.error-penalty-sublabel {
		font-family: var(--font-mono);
		font-size: clamp(0.7rem, 1.5vw, 0.9rem);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.3em;
		color: var(--accent-red);
		margin-top: 1.5rem;
		padding: 0.5rem 1.5rem;
		border: 2px solid var(--accent-red);
		border-radius: 4px;
		display: inline-block;
		background: rgba(255, 77, 77, 0.1);
	}

	@keyframes penaltyAppear {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		60% {
			transform: scale(1.05);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes penaltyPulse {
		0%, 100% {
			text-shadow:
				0 0 40px rgba(255, 77, 77, 0.6),
				0 0 80px rgba(255, 77, 77, 0.3),
				0 0 120px rgba(255, 77, 77, 0.15);
		}
		50% {
			text-shadow:
				0 0 60px rgba(255, 77, 77, 0.8),
				0 0 100px rgba(255, 77, 77, 0.5),
				0 0 160px rgba(255, 77, 77, 0.25);
		}
	}

	@media (max-width: 768px) {
		.stage-title {
			font-size: 36px;
		}

		.formula-card {
			padding: var(--spacing-lg);
		}

		.cards-grid {
			gap: var(--spacing-md);
		}

		.search-box {
			flex-wrap: wrap;
		}
	}
</style>
