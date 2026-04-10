<script>
	import { createEventDispatcher } from 'svelte';
	import { ANTIDOTE_COMPONENTS } from '$lib/toto/escape-game-config';
	
	const dispatch = createEventDispatcher();
	
	export let token;
	
	// Importer la configuration centralisée
	const antidoteComponents = ANTIDOTE_COMPONENTS;
	
	// État des champs
	let answers = Array(10).fill('');
	let errorMessage = '';
	
	// État de validation locale (indépendant de la synchro API)
	let validationResults = Array(10).fill(false);
	let lockedFields = Array(10).fill(false); // Champs verrouillés individuellement
	let animatingFields = Array(10).fill(null); // null, 'success', ou 'error'
	let isComplete = false;
	
	// État de synchronisation API (robuste contre les doublons)
	let syncedComponents = new Set();
	let isSyncing = false;
	
	// Références aux inputs pour la navigation
	let inputRefs = [];
	
	// Calculer la progression
	$: filledCount = validationResults.filter(Boolean).length;
	$: progressPercent = (filledCount / 10) * 100;
	
	function normalizeAnswer(answer) {
		return answer.toLowerCase().trim();
	}
	
	/**
	 * Synchronise un composant validé avec l'API
	 * Garantie : un composant ne sera synchronisé qu'une seule fois
	 */
	async function syncComponentToAPI(componentId, trialIndex) {
		// SÉCURITÉ 1 : Éviter les appels multiples pour le même composant
		if (syncedComponents.has(componentId)) {
			console.log(`Component ${componentId} already synced, skipping`);
			return true; // Déjà synchronisé = succès
		}
		
		try {
			const response = await fetch('/api/escape-game/validate-trial', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token,
					trialIndex,
					validated: true
				})
			});
			
			if (response.ok) {
				// SÉCURITÉ 2 : Marquer comme synchronisé uniquement en cas de succès
				syncedComponents.add(componentId);
				console.log(`Component ${componentId} synced successfully`);
				return true;
			} else {
				console.error(`Failed to sync component ${componentId}: HTTP ${response.status}`);
				return false;
			}
		} catch (err) {
			console.error(`Error syncing component ${componentId}:`, err);
			return false;
		}
	}
	
	/**
	 * Valide un champ individuel
	 */
	async function validateField(index) {
		if (lockedFields[index]) return; // Déjà validé
		
		const answer = normalizeAnswer(answers[index]);
		const expectedAnswer = antidoteComponents[index].answer;
		const isCorrect = answer === expectedAnswer;
		
		if (isCorrect) {
			// Animation de succès
			animatingFields[index] = 'success';
			validationResults[index] = true;
			lockedFields[index] = true;
			
			// Synchroniser avec l'API
			const component = antidoteComponents[index];
			if (!syncedComponents.has(component.id)) {
				await syncComponentToAPI(component.id, component.trialIndex);
			}
			
			// Retirer l'animation après un délai
			setTimeout(() => {
				animatingFields[index] = null;
			}, 600);
			
			// Vérifier si tous les champs sont validés
			if (validationResults.every(Boolean)) {
				isComplete = true;
				errorMessage = '';
				
				// Délai avant de passer à l'étape suivante
				setTimeout(() => {
					dispatch('complete');
				}, 2000);
			}
		} else {
			// Animation d'erreur
			animatingFields[index] = 'error';
			
			// Vider le champ après l'animation
			setTimeout(() => {
				answers[index] = '';
				animatingFields[index] = null;
			}, 400);
		}
	}
	
	/**
	 * Gestion de la navigation au clavier
	 */
	function handleKeyDown(event, index) {
		const { key } = event;
		
		// Validation avec Entrée
		if (key === 'Enter') {
			event.preventDefault();
			validateField(index);
			return;
		}
		
		// Navigation avec Tab (comportement natif, mais on peut l'améliorer)
		if (key === 'Tab') {
			// Le comportement par défaut du Tab est déjà bon
			return;
		}
		
		// Navigation avec flèches
		if (key === 'ArrowDown' || key === 'ArrowRight') {
			event.preventDefault();
			focusNextField(index);
		} else if (key === 'ArrowUp' || key === 'ArrowLeft') {
			event.preventDefault();
			focusPreviousField(index);
		}
	}
	
	/**
	 * Focus sur le champ suivant
	 */
	function focusNextField(currentIndex) {
		const nextIndex = (currentIndex + 1) % 10;
		if (inputRefs[nextIndex]) {
			inputRefs[nextIndex].focus();
		}
	}
	
	/**
	 * Focus sur le champ précédent
	 */
	function focusPreviousField(currentIndex) {
		const prevIndex = (currentIndex - 1 + 10) % 10;
		if (inputRefs[prevIndex]) {
			inputRefs[prevIndex].focus();
		}
	}
	
	// Fonction debug pour pré-remplir (à retirer en prod)
	function fillDebug() {
		answers = antidoteComponents.map(c => c.answer);
	}
</script>

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
					du virus Vaïk-17 en identifiant les 10 composants moléculaires nécessaires.
					<strong>Validez chaque champ avec la touche Entrée.</strong>
				</p>
			</div>
			
			<!-- Progress -->
			<div class="progress-section">
				<div class="progress-header">
					<span class="progress-label">PROGRESSION DE LA SYNTHÈSE</span>
					<span class="progress-count">{filledCount}/10 composants</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercent}%"></div>
				</div>
			</div>
			
			<!-- Formula Card -->
			<div class="formula-card">
				<div class="inputs-grid">
					{#each answers as answer, index}
						<div class="input-group">
							<label for="component-{index}" class="input-label">
								<span class="label-indicator"></span>
								<span class="label-text">COMPOSANT {(index + 1).toString().padStart(2, '0')}</span>
								{#if validationResults[index]}
									<span class="validation-badge validation-success">✓</span>
								{/if}
							</label>
							<input
								id="component-{index}"
								type="text"
								bind:value={answers[index]}
								bind:this={inputRefs[index]}
								disabled={lockedFields[index] || isComplete}
								placeholder={antidoteComponents[index].hint || "Élément chimique..."}
								on:keydown={(e) => handleKeyDown(e, index)}
								class="formula-input"
								class:input-valid={validationResults[index]}
								class:input-disabled={lockedFields[index] || isComplete}
								class:animate-success={animatingFields[index] === 'success'}
								class:animate-error={animatingFields[index] === 'error'}
							/>
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Info Panel -->
			<div class="info-panel">
				<span class="info-icon">ℹ</span>
				<div class="info-content">
					<p class="info-title">Navigation et validation</p>
					<p class="info-text">
						<strong>Entrée</strong> : valider le champ • 
						<strong>Tab</strong> : champ suivant • 
						<strong>↑↓←→</strong> : naviguer entre les champs
					</p>
				</div>
			</div>
			
			<!-- Warning Panel -->
			<div class="warning-panel">
				<span class="warning-icon">⚠</span>
				<div class="warning-content">
					<p class="warning-title">Contrainte de compatibilité moléculaire</p>
					<p class="warning-text">
						Les composants doivent être identifiés avec précision. Toute erreur dans la séquence
						pourrait compromettre l'efficacité de l'antidote.
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
					<span class="metric-label">Contamination</span>
					<span class="metric-value metric-danger">87%</span>
					<div class="metric-bar">
						<div class="metric-fill metric-fill-danger" style="width: 87%"></div>
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
					<span class="metric-value metric-cyan">14:23</span>
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
	
	/* Formula Card */
	.formula-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		padding: var(--spacing-2xl);
		margin-bottom: var(--spacing-xl);
	}
	
	.inputs-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-lg);
	}
	
	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}
	
	.input-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		font-weight: 600;
	}
	
	.label-indicator {
		width: 6px;
		height: 6px;
		background: var(--border-color);
		border-radius: 50%;
	}
	
	.label-text {
		flex: 1;
	}
	
	.validation-badge {
		font-size: 12px;
		padding: 2px 6px;
		border-radius: 3px;
		font-weight: 600;
	}
	
	.validation-success {
		background: var(--green-soft);
		color: var(--accent-green);
	}
	
	.validation-error {
		background: var(--red-soft);
		color: var(--accent-red);
	}
	
	.formula-input {
		width: 100%;
		padding: 12px 16px;
		background: var(--bg-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius);
		color: var(--text-primary);
		font-size: 14px;
		font-family: var(--font-ui);
		transition: all 0.2s ease;
	}
	
	.formula-input:focus {
		outline: none;
		border-color: var(--accent-cyan);
		box-shadow: 0 0 0 3px var(--cyan-soft);
	}
	
	.formula-input::placeholder {
		color: var(--text-muted);
	}
	
	.input-valid {
		border-color: var(--accent-green);
		background: rgba(0, 255, 163, 0.05);
	}
	
	.input-valid:focus {
		border-color: var(--accent-green);
		box-shadow: 0 0 0 3px var(--green-soft);
	}
	
	.input-disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	
	/* Animations */
	@keyframes successPulse {
		0% {
			transform: scale(1);
			border-color: var(--accent-green);
			box-shadow: 0 0 0 0 rgba(0, 255, 163, 0.7);
		}
		50% {
			transform: scale(1.02);
			box-shadow: 0 0 0 8px rgba(0, 255, 163, 0);
		}
		100% {
			transform: scale(1);
			border-color: var(--accent-green);
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
	
	.animate-success {
		animation: successPulse 0.6s ease-out;
		border-color: var(--accent-green) !important;
	}
	
	.animate-error {
		animation: errorShake 0.4s ease-out;
		border-color: var(--accent-red) !important;
		background: rgba(255, 77, 77, 0.1) !important;
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
	
	.message-error {
		background: var(--red-soft);
		border-color: rgba(255, 77, 77, 0.3);
		color: var(--accent-red);
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
		
		.inputs-grid {
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
	
	@media (max-width: 768px) {
		.stage-title {
			font-size: 36px;
		}
		
		.formula-card {
			padding: var(--spacing-lg);
		}
		
		.inputs-grid {
			gap: var(--spacing-md);
		}
	}
</style>
