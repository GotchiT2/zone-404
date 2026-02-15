<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	// État local - mise à jour automatique quand data change
	let trials = $state(data.trials);
	let timer = $state(data.timer);
	let roomId = $state(data.roomId);
	let roomName = $state(data.roomName);
	let runId = $state(data.runId);
	let messages = $state(data.messages || []);
	
	let eventSource: EventSource | null = null;
	let timerInterval: number | null = null;
	let displayTime = $state('--:--');
	
	// État pour les messages
	let messageText = $state('');
	let isSendingMessage = $state(false);
	let messageError = $state('');
	const MAX_MESSAGE_LENGTH = 500;
	
	// Calculer le nombre de trials validés
	let validatedCount = $derived(trials.filter(t => t.validated).length);
	let totalCount = $derived(trials.length);
	let progressPercentage = $derived((validatedCount / totalCount) * 100);
	
	// Formater le temps pour l'affichage
	function formatTime(ms: number): string {
		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		
		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
	
	// Mettre à jour l'affichage du timer
	function updateTimerDisplay() {
		if (!timer) {
			displayTime = '--:--';
			return;
		}
		
		if (timer.state === 'RUNNING') {
			const now = Date.now();
			const elapsed = timer.remainingMs - (now - new Date(timer.updatedAt).getTime());
			displayTime = formatTime(Math.max(0, elapsed));
		} else {
			displayTime = formatTime(timer.remainingMs);
		}
	}
	
	// Toggle validation d'une épreuve
	async function toggleTrial(index: number) {
		const trial = trials.find(t => t.index === index);
		if (!trial) return;
		
		try {
			const response = await fetch(`/api/gm/rooms/${roomId}/trials/${index}/set`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ validated: !trial.validated })
			});
			
			if (!response.ok) {
				console.error('Failed to toggle trial');
			}
		} catch (e) {
			console.error('Error toggling trial:', e);
		}
	}
	
	// Actions timer
	async function startTimer() {
		try {
			await fetch(`/api/gm/rooms/${roomId}/timer/start`, { method: 'POST' });
		} catch (e) {
			console.error('Error starting timer:', e);
		}
	}
	
	async function pauseTimer() {
		try {
			await fetch(`/api/gm/rooms/${roomId}/timer/pause`, { method: 'POST' });
		} catch (e) {
			console.error('Error pausing timer:', e);
		}
	}
	
	async function resumeTimer() {
		try {
			await fetch(`/api/gm/rooms/${roomId}/timer/resume`, { method: 'POST' });
		} catch (e) {
			console.error('Error resuming timer:', e);
		}
	}
	
	async function resetTimer() {
		if (!confirm('Êtes-vous sûr de vouloir réinitialiser le timer ?')) return;
		
		try {
			await fetch(`/api/gm/rooms/${roomId}/timer/reset`, { method: 'POST' });
		} catch (e) {
			console.error('Error resetting timer:', e);
		}
	}
	
	async function addOneMinute() {
		try {
			await fetch(`/api/gm/rooms/${roomId}/timer/add-time`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ms: 60000 })
			});
		} catch (e) {
			console.error('Error adding time:', e);
		}
	}
	
	async function subtractOneMinute() {
		try {
			await fetch(`/api/gm/rooms/${roomId}/timer/subtract-time`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ms: 60000 })
			});
		} catch (e) {
			console.error('Error subtracting time:', e);
		}
	}
	
	async function resetRun() {
		if (!confirm('Êtes-vous sûr de vouloir réinitialiser toute la session ? Toutes les épreuves seront remises à zéro.')) return;
		
		try {
			await fetch(`/api/gm/rooms/${roomId}/runs/current/reset`, { method: 'POST' });
		} catch (e) {
			console.error('Error resetting run:', e);
		}
	}
	
	async function logout() {
		try {
			await fetch('/admin/gm/logout', { method: 'POST' });
			goto('/admin/gm/login');
		} catch (e) {
			console.error('Error logging out:', e);
		}
	}
	
	async function sendMessage() {
		const trimmed = messageText.trim();
		
		if (!trimmed) {
			messageError = 'Le message ne peut pas être vide';
			return;
		}
		
		if (trimmed.length > MAX_MESSAGE_LENGTH) {
			messageError = `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`;
			return;
		}
		
		isSendingMessage = true;
		messageError = '';
		
		try {
			const response = await fetch(`/api/gm/rooms/${roomId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: trimmed })
			});
			
			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi' }));
				messageError = error.message || 'Erreur lors de l\'envoi du message';
				return;
			}
			
			messageText = '';
		} catch (e) {
			console.error('Error sending message:', e);
			messageError = 'Erreur réseau lors de l\'envoi du message';
		} finally {
			isSendingMessage = false;
		}
	}
	
	function formatMessageTime(isoString: string): string {
		const date = new Date(isoString);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}
	
	function setupSSE() {
		if (eventSource) {
			eventSource.close();
		}
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		
		eventSource = new EventSource(`/api/gm/rooms/${roomId}/stream`);
		
		eventSource.addEventListener('state', (e) => {
			const newData = JSON.parse(e.data);
			trials = newData.trials;
			timer = newData.timer;
			runId = newData.runId;
			updateTimerDisplay();
		});
		
		eventSource.addEventListener('trial_set', (e) => {
			const newData = JSON.parse(e.data);
			const trial = trials.find(t => t.index === newData.index);
			if (trial) {
				trial.validated = newData.validated;
				trial.validatedAt = newData.validatedAt;
				trials = [...trials];
			}
		});
		
		eventSource.addEventListener('reset', (e) => {
			const newData = JSON.parse(e.data);
			trials = newData.trials;
			timer = newData.timer;
			runId = newData.runId;
			messages = [];
			updateTimerDisplay();
		});
		
		eventSource.addEventListener('timer_state', (e) => {
			const newData = JSON.parse(e.data);
			timer = {
				state: newData.status,
				remainingMs: newData.remainingMs,
				updatedAt: newData.serverNow
			};
			updateTimerDisplay();
		});
		
		eventSource.addEventListener('message_created', (e) => {
			const newData = JSON.parse(e.data);
			messages = [...messages, newData];
		});
		
		eventSource.onerror = (e) => {
			console.error('SSE error:', e);
		};
		
		updateTimerDisplay();
		timerInterval = window.setInterval(updateTimerDisplay, 1000);
	}
	
	$effect(() => {
		if (browser && roomId) {
			setupSSE();
		}
	});
	
	onMount(() => {
		setupSSE();
	});
	
	onDestroy(() => {
		if (eventSource) {
			eventSource.close();
		}
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	});
</script>

<svelte:head>
	<title>{roomName} - Game Master - Zone 404</title>
</svelte:head>

<div class="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
	<!-- Header -->
	<div class="card variant-gradient-primary-secondary p-6 shadow-2xl border-2 border-primary-500/30">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div class="space-y-3">
				<h1 class="h2 font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
					🎮 {roomName}
				</h1>
				<div class="flex gap-2 flex-wrap">
					<a href="/admin/gm/salle-1" class="chip {roomId === 'salle-1' ? 'preset-filled-primary-500 shadow-lg' : 'preset-outlined-primary-500 hover:preset-filled-primary-500'} transition-all">
						Salle 1
					</a>
					<a href="/admin/gm/salle-2" class="chip {roomId === 'salle-2' ? 'preset-filled-primary-500 shadow-lg' : 'preset-outlined-primary-500 hover:preset-filled-primary-500'} transition-all">
						Salle 2
					</a>
					<a href="/admin/gm/salle-3" class="chip {roomId === 'salle-3' ? 'preset-filled-primary-500 shadow-lg' : 'preset-outlined-primary-500 hover:preset-filled-primary-500'} transition-all">
						Salle 3
					</a>
				</div>
			</div>
			<button class="btn preset-filled-error-500 shadow-lg hover:shadow-error-500/50 transition-all" onclick={logout}>
				🚪 Déconnexion
			</button>
		</div>
	</div>

	<!-- Progress Section -->
	<div class="card variant-gradient-success-warning p-6 shadow-xl border-2 border-success-500/30">
		<h2 class="h3 mb-4 flex items-center gap-2">
			<span>📊</span>
			<span class="bg-gradient-to-r from-success-400 to-warning-400 bg-clip-text text-transparent font-bold">Progression</span>
		</h2>
		<div class="flex items-baseline gap-3 mb-4">
			<span class="text-6xl font-black bg-gradient-to-br from-success-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">
				{validatedCount} / {totalCount}
			</span>
			<span class="text-xl font-semibold text-surface-200">épreuves validées</span>
		</div>
		<div class="w-full bg-surface-700 rounded-full h-8 overflow-hidden shadow-inner border-2 border-surface-600">
			<div 
				class="h-full bg-gradient-to-r from-success-500 via-primary-500 to-secondary-500 transition-all duration-500 ease-out shadow-lg flex items-center justify-center text-white font-bold"
				style="width: {progressPercentage}%"
			>
				{#if progressPercentage > 15}
					<span class="drop-shadow-lg">{Math.round(progressPercentage)}%</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Trials Section -->
	<div class="card variant-glass-surface p-6 shadow-xl border-2 border-tertiary-500/30">
		<h2 class="h3 mb-6 flex items-center gap-2">
			<span>🎯</span>
			<span class="bg-gradient-to-r from-tertiary-400 to-primary-400 bg-clip-text text-transparent font-bold">Épreuves</span>
		</h2>
		<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
			{#each trials as trial (trial.index)}
				<button
					class="aspect-square rounded-full border-4 font-bold text-2xl transition-all hover:scale-125 active:scale-95 {trial.validated ? 'border-success-500 bg-gradient-to-br from-success-500/30 to-success-600/50 text-success-400 shadow-lg shadow-success-500/50 hover:shadow-xl hover:shadow-success-500/70' : 'border-error-500 bg-gradient-to-br from-error-500/30 to-error-600/50 text-error-400 shadow-lg shadow-error-500/50 hover:shadow-xl hover:shadow-error-500/70'}"
					onclick={() => toggleTrial(trial.index)}
					title={trial.label}
				>
					{trial.index}
				</button>
			{/each}
		</div>
	</div>

	<!-- Timer Section -->
	<div class="card variant-gradient-tertiary-primary p-6 shadow-2xl border-2 border-tertiary-500/30">
		<h2 class="h3 mb-6 flex items-center gap-2">
			<span>⏱️</span>
			<span class="bg-gradient-to-r from-tertiary-400 to-warning-400 bg-clip-text text-transparent font-bold">Timer</span>
		</h2>
		<div class="text-center space-y-6">
			<div class="relative inline-block">
				<div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-2xl rounded-lg"></div>
				<div class="relative font-mono text-7xl md:text-8xl font-black p-8 bg-surface-800/80 backdrop-blur-sm rounded-2xl border-4 {timer?.state === 'RUNNING' ? 'border-success-500 text-success-400 shadow-2xl shadow-success-500/50 animate-pulse' : timer?.state === 'PAUSED' ? 'border-warning-500 text-warning-400 shadow-2xl shadow-warning-500/50' : 'border-surface-600 text-surface-300 shadow-xl'}">
					{displayTime}
				</div>
			</div>
			<div class="text-xl">
				État: <span class="badge preset-filled-primary-500 uppercase text-lg px-4 py-2 shadow-lg">{timer?.state || 'IDLE'}</span>
			</div>
		</div>
		
		<div class="flex flex-wrap gap-3 justify-center mt-6">
			{#if timer?.state === 'IDLE' || timer?.state === 'ENDED'}
				<button class="btn preset-filled-success-500 btn-lg shadow-xl hover:shadow-2xl hover:shadow-success-500/50 transition-all" onclick={startTimer}>
					▶ Démarrer
				</button>
			{:else if timer?.state === 'RUNNING'}
				<button class="btn preset-filled-warning-500 btn-lg shadow-xl hover:shadow-2xl hover:shadow-warning-500/50 transition-all" onclick={pauseTimer}>
					⏸ Pause
				</button>
			{:else if timer?.state === 'PAUSED'}
				<button class="btn preset-filled-success-500 btn-lg shadow-xl hover:shadow-2xl hover:shadow-success-500/50 transition-all" onclick={resumeTimer}>
					▶ Reprendre
				</button>
			{/if}
			<button class="btn preset-filled-secondary-500 btn-lg shadow-xl hover:shadow-2xl hover:shadow-secondary-500/50 transition-all" onclick={resetTimer}>
				🔄 Reset Timer
			</button>
		</div>
		
		<div class="flex gap-3 mt-4">
			<button class="btn preset-filled-tertiary-500 flex-1 shadow-lg hover:shadow-xl hover:shadow-tertiary-500/50 transition-all" onclick={subtractOneMinute}>
				➖ 1 min
			</button>
			<button class="btn preset-filled-tertiary-500 flex-1 shadow-lg hover:shadow-xl hover:shadow-tertiary-500/50 transition-all" onclick={addOneMinute}>
				➕ 1 min
			</button>
		</div>
	</div>

	<!-- Messages Section -->
	<div class="card variant-glass-primary p-6 shadow-xl border-2 border-primary-500/30">
		<h2 class="h3 mb-6 flex items-center gap-2">
			<span>💬</span>
			<span class="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent font-bold">Messages aux joueurs</span>
		</h2>
		
		<div class="space-y-4">
			<label class="label">
				<span class="text-lg font-semibold text-surface-200 mb-2 block">Message</span>
				<textarea
					class="textarea bg-surface-800 border-2 border-surface-600 focus:border-primary-500 text-surface-100 placeholder-surface-400 shadow-inner transition-all"
					bind:value={messageText}
					placeholder="Écrivez un message aux joueurs..."
					maxlength={MAX_MESSAGE_LENGTH}
					rows="4"
					disabled={isSendingMessage}
				></textarea>
			</label>
			
			<div class="flex justify-between items-center">
				<span class="text-sm font-mono {messageText.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-warning-400 font-bold animate-pulse' : 'text-surface-400'}">
					{messageText.length} / {MAX_MESSAGE_LENGTH}
				</span>
				<button 
					class="btn preset-filled-primary-500 shadow-lg hover:shadow-xl hover:shadow-primary-500/50 transition-all"
					onclick={sendMessage}
					disabled={isSendingMessage || !messageText.trim()}
				>
					{isSendingMessage ? '⏳ Envoi...' : '📤 Envoyer'}
				</button>
			</div>
			
			{#if messageError}
				<aside class="alert preset-filled-error-500 shadow-lg">
					<div class="alert-message">
						<p class="font-semibold">❌ {messageError}</p>
					</div>
				</aside>
			{/if}
		</div>
		
		<div class="space-y-4 mt-8">
			<h3 class="h4 text-surface-200 font-bold flex items-center gap-2">
				<span>📜</span>
				Historique de la session
			</h3>
			{#if messages.length === 0}
				<div class="card preset-tonal-surface p-8 text-center">
					<p class="text-surface-400 italic text-lg">
						💤 Aucun message envoyé pour cette session
					</p>
				</div>
			{:else}
				<div class="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-surface-700">
					{#each messages as message (message.id)}
						<div class="card variant-gradient-primary-secondary p-4 flex gap-3 shadow-lg hover:shadow-xl transition-all border border-primary-500/30">
							<span class="badge preset-filled-primary-500 font-mono text-sm px-3 py-1 shadow-md shrink-0">
								⏰ {formatMessageTime(message.createdAt)}
							</span>
							<span class="flex-1 text-surface-100 font-medium leading-relaxed">
								{message.text}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Reset Run Section -->
	<div class="card variant-gradient-error-warning p-6 shadow-2xl border-2 border-error-500/50">
		<button class="btn preset-filled-error-500 w-full text-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-error-500/50 transition-all py-4" onclick={resetRun}>
			🔄 Réinitialiser la Session
		</button>
	</div>
</div>
