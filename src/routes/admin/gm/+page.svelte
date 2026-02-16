<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Types pour les données de salle
	interface RoomData {
		roomId: string;
		roomName: string;
		runId?: number;
		trials?: Array<{
			index: number;
			label: string;
			validated: boolean;
			validatedAt?: string;
		}> | undefined;
		timer?: {
			state: string;
			remainingMs: number;
			updatedAt: string;
		} | null | undefined;
		messages?: Array<{
			id: string;
			text: string;
			createdBy: string;
			createdAt: string;
		}> | undefined;
		error?: string | undefined;
		displayTime: string;
		messageText: string;
		isSendingMessage: boolean;
		messageError: string;
		isExpanded: boolean;
	}

	// État pour chaque salle
	let rooms = $state<RoomData[]>(data.rooms.map(room => ({
		...room,
		displayTime: '--:--',
		messageText: '',
		isSendingMessage: false,
		messageError: '',
		isExpanded: true
	})));

	const MAX_MESSAGE_LENGTH = 500;
	let eventSources: EventSource[] = [];
	let timerIntervals: number[] = [];

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

	// Mettre à jour l'affichage du timer pour une salle
	function updateTimerDisplay(roomIndex: number) {
		const room = rooms[roomIndex];
		if (!room.timer) {
			room.displayTime = '--:--';
			return;
		}

		if (room.timer.state === 'RUNNING') {
			const now = Date.now();
			const elapsed = room.timer.remainingMs - (now - new Date(room.timer.updatedAt).getTime());
			room.displayTime = formatTime(Math.max(0, elapsed));
		} else {
			room.displayTime = formatTime(room.timer.remainingMs);
		}
	}

	// Actions timer
	async function startTimer(roomId: string) {
		await fetch(`/api/gm/rooms/${roomId}/timer/start`, { method: 'POST' });
	}

	async function pauseTimer(roomId: string) {
		await fetch(`/api/gm/rooms/${roomId}/timer/pause`, { method: 'POST' });
	}

	async function resumeTimer(roomId: string) {
		await fetch(`/api/gm/rooms/${roomId}/timer/resume`, { method: 'POST' });
	}

	async function resetTimer(roomId: string) {
		if (!confirm(`Réinitialiser le timer de ${roomId} ?`)) return;
		await fetch(`/api/gm/rooms/${roomId}/timer/reset`, { method: 'POST' });
	}

	async function resetRun(roomId: string, roomName: string) {
		if (!confirm(`Réinitialiser toute la session de ${roomName} ? Toutes les épreuves seront remises à zéro.`)) return;
		await fetch(`/api/gm/rooms/${roomId}/runs/current/reset`, { method: 'POST' });
	}
	
	async function toggleTrial(roomId: string, trialIndex: number, currentValidated: boolean) {
		try {
			await fetch(`/api/gm/rooms/${roomId}/trials/${trialIndex}/set`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ validated: !currentValidated })
			});
		} catch (e) {
			console.error('Error toggling trial:', e);
		}
	}
	
	async function sendMessage(roomIndex: number) {
		const room = rooms[roomIndex];
		const trimmed = room.messageText.trim();

		if (!trimmed) {
			room.messageError = 'Le message ne peut pas être vide';
			return;
		}

		if (trimmed.length > MAX_MESSAGE_LENGTH) {
			room.messageError = `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`;
			return;
		}

		room.isSendingMessage = true;
		room.messageError = '';

		try {
			const response = await fetch(`/api/gm/rooms/${room.roomId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: trimmed })
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: 'Erreur lors de l\'envoi' }));
				room.messageError = error.message || 'Erreur lors de l\'envoi du message';
				return;
			}

			room.messageText = '';
		} catch (e) {
			console.error('Error sending message:', e);
			room.messageError = 'Erreur réseau lors de l\'envoi du message';
		} finally {
			room.isSendingMessage = false;
		}
	}

	function toggleExpanded(roomIndex: number) {
		rooms[roomIndex].isExpanded = !rooms[roomIndex].isExpanded;
	}

	async function logout() {
		await fetch('/gm/logout', { method: 'POST' });
		goto('/gm/login');
	}

	function setupSSE() {
		// Nettoyer les anciennes connexions
		eventSources.forEach(es => es.close());
		timerIntervals.forEach(interval => clearInterval(interval));
		eventSources = [];
		timerIntervals = [];

		// Créer une connexion SSE pour chaque salle
		rooms.forEach((room, index) => {
			if (room.error) return; // Skip rooms without active runs

			const eventSource = new EventSource(`/api/gm/rooms/${room.roomId}/stream`);

			eventSource.addEventListener('state', (e) => {
				const newData = JSON.parse(e.data);
				rooms[index].trials = newData.trials;
				rooms[index].timer = newData.timer;
				rooms[index].runId = newData.runId;
				updateTimerDisplay(index);
			});

			eventSource.addEventListener('trial_set', (e) => {
				const newData = JSON.parse(e.data);
				const trial = rooms[index].trials?.find(t => t.index === newData.index);
				if (trial) {
					trial.validated = newData.validated;
					trial.validatedAt = newData.validatedAt;
					rooms[index].trials = [...(rooms[index].trials || [])];
				}
			});

			eventSource.addEventListener('reset', (e) => {
				const newData = JSON.parse(e.data);
				rooms[index].trials = newData.trials;
				rooms[index].timer = newData.timer;
				rooms[index].runId = newData.runId;
				rooms[index].messages = [];
				updateTimerDisplay(index);
			});

			eventSource.addEventListener('timer_state', (e) => {
				const newData = JSON.parse(e.data);
				rooms[index].timer = {
					state: newData.status,
					remainingMs: newData.remainingMs,
					updatedAt: newData.serverNow
				};
				updateTimerDisplay(index);
			});

			eventSource.addEventListener('message_created', (e) => {
				const newData = JSON.parse(e.data);
				rooms[index].messages = [...(rooms[index].messages || []), newData];
			});

			eventSource.onerror = (e) => {
				console.error(`SSE error for ${room.roomId}:`, e);
			};

			eventSources.push(eventSource);

			// Timer interval pour l'affichage
			updateTimerDisplay(index);
			const interval = window.setInterval(() => updateTimerDisplay(index), 1000);
			timerIntervals.push(interval);
		});
	}

	onMount(() => {
		if (browser) {
			setupSSE();
		}
	});

	onDestroy(() => {
		eventSources.forEach(es => es.close());
		timerIntervals.forEach(interval => clearInterval(interval));
	});
</script>

<svelte:head>
	<title>Dashboard GM - Zone 404</title>
</svelte:head>

<div class="p-4 md:p-6 space-y-6 bg-white w-full text-black">
	<!-- Header -->
	<div class="card p-6 shadow-2xl border-2 border-primary-500/30">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div>
				<h1 class="h2 font-bold">
					🎮 Dashboard Game Master
				</h1>
				<p class="mt-2">Gestion centralisée des 3 salles d'escape game</p>
			</div>
			<button class="btn preset-filled-error-500 shadow-lg hover:shadow-error-500/50 transition-all" onclick={logout}>
				🚪 Déconnexion
			</button>
		</div>
	</div>

	<!-- Rooms Grid -->
	<div class="flex flex-col lg:flex-row gap-4">
		{#each rooms as room, roomIndex (room.roomId)}
			<div class="card p-5 shadow-xl border-2 border-primary-500/30 space-y-4 flex-1">
				<!-- Room Header -->
				<div class="flex justify-between items-center">
					<div class="flex items-center gap-3">
						<button
							class="btn btn-sm preset-tonal-surface"
							onclick={() => toggleExpanded(roomIndex)}
							aria-label={room.isExpanded ? 'Collapse' : 'Expand'}
						>
							<svg 
								class="w-5 h-5 transition-transform duration-200" 
								class:rotate-180={!room.isExpanded}
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
							</svg>
						</button>
						<h2 class="h3 font-bold">
							{room.roomName}
						</h2>
					</div>
					<a href="/admin/gm/{room.roomId}" class="chip preset-filled-secondary-500 hover:preset-filled-primary-500 transition-all">
						Détails →
					</a>
				</div>

				{#if room.isExpanded}
					{#if room.error}
						<div class="alert preset-filled-warning-500">
							<p class="font-semibold">⚠️ {room.error}</p>
						</div>
					{:else}
					<!-- Progress -->
					{@const validatedCount = room.trials?.filter(t => t.validated).length || 0}
					{@const totalCount = room.trials?.length || 0}
					{@const percentage = totalCount > 0 ? (validatedCount / totalCount) * 100 : 0}

					<div class="space-y-2">
						<div class="flex justify-between items-baseline">
							<span class="text-2xl font-bold text-success-400">{validatedCount}/{totalCount}</span>
							<span class="text-sm text-surface-400">épreuves</span>
						</div>
						<div class="w-full bg-surface-700 rounded-full h-4 overflow-hidden shadow-inner">
							<div
								class="h-full bg-gradient-to-r from-success-500 to-primary-500 transition-all duration-500"
								style="width: {percentage}%"
							></div>
						</div>
					</div>

					<!-- Timer -->
					<div class="card preset-tonal-surface p-4 space-y-3">
						<div class="flex items-center gap-2">
							<span class="text-lg">⏱️</span>
							<span class="font-semibold text-surface-200">Timer</span>
						</div>
						<div class="font-mono text-4xl font-black text-center {room.timer?.state === 'RUNNING' ? 'text-success-400' : room.timer?.state === 'PAUSED' ? 'text-warning-400' : 'text-surface-400'}">
							{room.displayTime}
						</div>
						<div class="flex gap-2 flex-wrap justify-center">
							{#if room.timer?.state === 'IDLE' || room.timer?.state === 'ENDED'}
								<button class="btn preset-filled-success-500 btn-sm" onclick={() => startTimer(room.roomId)}>
									▶
								</button>
							{:else if room.timer?.state === 'RUNNING'}
								<button class="btn preset-filled-warning-500 btn-sm" onclick={() => pauseTimer(room.roomId)}>
									⏸
								</button>
							{:else if room.timer?.state === 'PAUSED'}
								<button class="btn preset-filled-success-500 btn-sm" onclick={() => resumeTimer(room.roomId)}>
									▶
								</button>
							{/if}
							<button class="btn preset-filled-secondary-500 btn-sm" onclick={() => resetTimer(room.roomId)}>
								🔄
							</button>
						</div>
					</div>

					<!-- Trials Grid -->
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span>🎯</span>
							<span class="font-semibold text-surface-200">Épreuves</span>
						</div>
						<div class="flex gap-2 flex-wrap">
							{#each room.trials || [] as trial (trial.index)}
								<button
									class="trial-circle"
									class:validated={trial.validated}
									title={trial.label}
									onclick={() => toggleTrial(room.roomId, trial.index, trial.validated)}
								>
									{trial.index}
								</button>
							{/each}
						</div>
					</div>

				<!-- Message Form -->
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<span>💬</span>
						<span class="font-semibold text-surface-200">Message</span>
					</div>
					<textarea
						class="textarea bg-surface-800 border border-surface-600 text-surface-100 text-sm"
						bind:value={room.messageText}
						placeholder="Message aux joueurs..."
						maxlength={MAX_MESSAGE_LENGTH}
						rows="2"
						disabled={room.isSendingMessage}
					></textarea>
					<div class="flex justify-between items-center">
						<span class="text-xs {room.messageText.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-warning-400' : 'text-surface-500'}">
							{room.messageText.length}/{MAX_MESSAGE_LENGTH}
						</span>
						<button
							class="btn preset-filled-primary-500 btn-sm"
							onclick={() => sendMessage(roomIndex)}
							disabled={room.isSendingMessage || !room.messageText.trim()}
						>
							{room.isSendingMessage ? '⏳' : '📤'} Envoyer
						</button>
					</div>
					{#if room.messageError}
						<p class="text-error-400 text-xs">❌ {room.messageError}</p>
					{/if}
					
					<!-- Message History -->
					{#if room.messages && room.messages.length > 0}
						<div class="mt-3 pt-3 border-t border-surface-600">
							<div class="text-xs font-semibold text-surface-400 mb-2">Derniers messages :</div>
							<div class="space-y-1 max-h-32 overflow-y-auto">
								{#each room.messages as message (message.id)}
									<div class="card preset-tonal-primary p-2 text-xs">
										<div class="flex items-start gap-2">
											<span class="badge preset-filled-primary-500 text-[10px] px-1 py-0.5 shrink-0">
												{new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
											</span>
											<span class="text-surface-100 flex-1 text-xs leading-relaxed">
												{message.text}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>

						<!-- Actions -->
						<div class="pt-2 border-t border-surface-600">
							<button
								class="btn preset-filled-error-500 w-full btn-sm"
								onclick={() => resetRun(room.roomId, room.roomName)}
							>
								🔄 Reset Session
							</button>
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.trial-circle {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid #e74c3c;
		background: #fee;
		color: #e74c3c;
		font-size: 24px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.trial-circle:hover {
		transform: scale(1.1);
	}

	.trial-circle.validated {
		border-color: #27ae60;
		background: #d4edda;
		color: #27ae60;
	}
</style>