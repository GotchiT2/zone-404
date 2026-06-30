<script lang="ts">
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import DebugStage from '$lib/components/escape-game/DebugStage.svelte';
	import AntidoteStage from '$lib/components/escape-game/AntidoteStage.svelte';
	import SuccessStage from '$lib/components/escape-game/SuccessStage.svelte';
	import DefeatStage from '$lib/components/escape-game/DefeatStage.svelte';
	import LoadingStage from '$lib/components/escape-game/LoadingStage.svelte';
	import { SEARCHABLE_ITEMS, GAME_STAGES } from '$lib/toto/escape-game-config';

	export let data: PageData;

	// Salle suivie pour le lancement de la partie (cohérent avec AntidoteStage)
	const TIMER_ROOM_ID = 'salle-3';

	// Index des épreuves correspondant à chaque stade (source : config du jeu)
	const DEBUG_TRIAL = GAME_STAGES.find((s) => s.id === 'debug')?.trialIndex ?? 1;
	const ANTIDOTE_TRIALS = SEARCHABLE_ITEMS.filter((i) => i.isComponent).map(
		(i) => i.trialIndex as number
	);

	// Détermine le stade courant à partir des épreuves déjà validées en base,
	// afin de reprendre au bon endroit après un rechargement.
	function resolveInitialStage(validated: number[]): 'debug' | 'antidote' | 'success' {
		const set = new Set(validated);
		if (ANTIDOTE_TRIALS.length > 0 && ANTIDOTE_TRIALS.every((t) => set.has(t))) return 'success';
		if (set.has(DEBUG_TRIAL)) return 'antidote';
		return 'debug';
	}

	// État du jeu : 'debug' | 'antidote' | 'success' | 'defeat'
	let currentStage: 'debug' | 'antidote' | 'success' | 'defeat' = resolveInitialStage(
		data.validatedTrials ?? []
	);

	// Temps restant dans la partie au moment de la validation finale
	// (reconstitué depuis la base si on recharge directement sur l'écran de victoire)
	let remainingTime: string | null = data.remainingTime ?? null;

	// Gestion de la progression
	function handleDebugComplete() {
		currentStage = 'antidote';
	}

	// Live population data forwarded from AntidoteStage on completion/defeat
	let liveSurvivors: string | null = null;
	let liveErrorCount: number | null = null;
	let defeatReason: 'time' | 'population' = 'time';

	function handleAntidoteComplete(event: CustomEvent<{ remainingTime?: string; survivors?: string; errorCount?: number }>) {
		remainingTime = event.detail?.remainingTime ?? null;
		liveSurvivors = event.detail?.survivors ?? null;
		liveErrorCount = event.detail?.errorCount ?? null;
		currentStage = 'success';
	}

	function handleAntidoteDefeat(event: CustomEvent<{ reason?: string; survivors?: string; errorCount?: number }>) {
		defeatReason = (event.detail?.reason as 'time' | 'population') ?? 'time';
		liveSurvivors = event.detail?.survivors ?? null;
		liveErrorCount = event.detail?.errorCount ?? null;
		currentStage = 'defeat';
	}

	// --- Écran de chargement tant que le GM n'a pas lancé la partie ---
	// La partie est lancée dès que le timer quitte l'état IDLE (événement SSE).
	let gameStarted: boolean = data.gameStarted ?? false;
	let startEventSource: EventSource | null = null;
	let startReconnectTimeout: ReturnType<typeof setTimeout> | null = null;

	function teardownStartWatcher() {
		if (startEventSource) {
			startEventSource.close();
			startEventSource = null;
		}
		if (startReconnectTimeout) {
			clearTimeout(startReconnectTimeout);
			startReconnectTimeout = null;
		}
	}

	function watchGameStart() {
		if (!browser || gameStarted) return;
		if (startEventSource) startEventSource.close();

		startEventSource = new EventSource(`/api/rooms/${TIMER_ROOM_ID}/events`);

		startEventSource.addEventListener('timer_state', (e) => {
			try {
				const state = JSON.parse((e as MessageEvent).data);
				if (state.status && state.status !== 'IDLE') {
					gameStarted = true;
					teardownStartWatcher();
				}
			} catch (err) {
				console.error('Timer state parse error:', err);
			}
		});

		startEventSource.onerror = () => {
			// Reconnexion (ex: run/timer pas encore créé côté GM)
			startEventSource?.close();
			startEventSource = null;
			startReconnectTimeout = setTimeout(() => {
				if (browser && !gameStarted) watchGameStart();
			}, 5000);
		};
	}

	// --- Background audio loop ---
	let bgAudio: HTMLAudioElement | null = null;
	let audioStarted = false;

	function startAudioIfNeeded() {
		if (audioStarted || !bgAudio) return;
		bgAudio.volume = 0.3;
		bgAudio.play().then(() => {
			audioStarted = true;
		}).catch(() => {
			// Browser blocked autoplay — will retry on next interaction
		});
	}

	function handleFirstInteraction() {
		startAudioIfNeeded();
	}

	onMount(() => {
		watchGameStart();
		// Try autoplay immediately (works if user already interacted with the page)
		startAudioIfNeeded();
	});
	onDestroy(() => {
		teardownStartWatcher();
		if (bgAudio) {
			bgAudio.pause();
			bgAudio = null;
		}
	});
</script>

<svelte:head>
	<title>Projet Vaïk 17 - Laboratoire de l'extinction</title>
	<meta name="google" content="notranslate">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="lab-container" on:click={handleFirstInteraction} on:keydown={handleFirstInteraction}>
	<audio bind:this={bgAudio} src="/sound-effect.wav" loop preload="auto"></audio>
	<div class="lab-content">
		<main class="game-area">
			{#if !gameStarted}
				<LoadingStage />
			{:else if currentStage === 'debug'}
				<DebugStage token={data.token} on:complete={handleDebugComplete} />
			{:else if currentStage === 'antidote'}
		<AntidoteStage
			token={data.token}
			validatedTrials={data.validatedTrials ?? []}
			initialErrorCount={data.errorCount ?? 0}
			on:complete={handleAntidoteComplete}
			on:defeat={handleAntidoteDefeat}
		/>
		{:else if currentStage === 'success'}
		<SuccessStage 
				roomName={data.roomName} 
				{remainingTime} 
				survivors={liveSurvivors ?? data.survivors}
				errorCount={liveErrorCount ?? data.errorCount}
		/>
		{:else if currentStage === 'defeat'}
		<DefeatStage
			roomName={data.roomName}
			reason={defeatReason}
			survivors={liveSurvivors ?? data.survivors}
			errorCount={liveErrorCount ?? data.errorCount}
		/>
		{/if}
		</main>
	</div>
</div>

<style>
	:global(:root) {
		/* Palette de couleurs */
		--bg-primary: #020617;
		--bg-secondary: #0B1220;
		--bg-panel: #111827;
		--bg-panel-light: #1E293B;
		--border-color: #1E293B;
		
		--text-primary: #E2E8F0;
		--text-secondary: #94A3B8;
		--text-muted: #64748B;
		
		--accent-cyan: #00E5FF;
		--accent-green: #00FFA3;
		--accent-red: #FF4D4D;
		--accent-orange: #FFA500;
		
		/* Opacités */
		--red-soft: rgba(255, 77, 77, 0.10);
		--cyan-soft: rgba(0, 229, 255, 0.08);
		--green-soft: rgba(0, 255, 163, 0.10);
		
		/* Typographie */
		--font-ui: 'Inter', system-ui, -apple-system, sans-serif;
		--font-mono: 'JetBrains Mono', 'Courier New', monospace;
		
		/* Espacements */
		--radius: 8px;
		--spacing-xs: 8px;
		--spacing-sm: 12px;
		--spacing-md: 16px;
		--spacing-lg: 24px;
		--spacing-xl: 32px;
		--spacing-2xl: 40px;
	}
	
	:global(*) {
		box-sizing: border-box;
	}
	
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-ui);
		background: var(--bg-primary);
		color: var(--text-primary);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.lab-container {
		min-height: 100vh;
		background: var(--bg-primary);
	}
	
	.lab-content {
		max-width: 1600px;
		margin: 0 auto;
		padding: var(--spacing-2xl);
	}
	
	.game-area {
		/* Pas de styles ici, tout dans les composants */
	}
	
	/* Responsive */
	@media (max-width: 1024px) {
		.lab-content {
			padding: var(--spacing-lg);
		}
	}
	
	@media (max-width: 768px) {
		.lab-content {
			padding: var(--spacing-md);
		}
	}
</style>