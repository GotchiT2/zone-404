<script lang="ts">
	import type { PageData } from './$types';
	import DebugStage from '$lib/components/escape-game/DebugStage.svelte';
	import AntidoteStage from '$lib/components/escape-game/AntidoteStage.svelte';
	import SuccessStage from '$lib/components/escape-game/SuccessStage.svelte';
	
	export let data: PageData;
	
	// État du jeu : 'debug' | 'antidote' | 'success'
	let currentStage: 'debug' | 'antidote' | 'success' = 'debug';
	
	// Gestion de la progression
	function handleDebugComplete() {
		currentStage = 'antidote';
	}
	
	function handleAntidoteComplete() {
		currentStage = 'success';
	}
	
	// Reset du jeu (recommencer)
	function handleRestart() {
		// Confirmation avant de recommencer
		const confirmed = confirm('Êtes-vous sûr de vouloir recommencer l\'expérience ? Cela vous ramènera au début.');
		
		if (confirmed) {
			// Retour à l'étape initiale
			currentStage = 'debug';
			
			// Scroll vers le haut
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Projet Vaïk 17 - Laboratoire de l'extinction</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="lab-container">
	<div class="lab-content">
		<main class="game-area">
			{#if currentStage === 'debug'}
				<DebugStage token={data.token} on:complete={handleDebugComplete} />
			{:else if currentStage === 'antidote'}
				<AntidoteStage token={data.token} on:complete={handleAntidoteComplete} />
			{:else}
				<SuccessStage roomName={data.roomName} on:restart={handleRestart} />
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