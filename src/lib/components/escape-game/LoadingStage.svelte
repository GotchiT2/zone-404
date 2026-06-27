<script>
	// Écran d'attente affiché tant que le maître du jeu n'a pas lancé la partie.
</script>

<div class="loading-stage">
	<div class="loading-box">
		<div class="loading-ring">
			<span class="ring-core"></span>
		</div>

		<p class="loading-eyebrow">LABORATOIRE VAÏK-17</p>
		<h1 class="loading-title">En attente de lancement</h1>
		<p class="loading-text">
			Le maître du jeu n'a pas encore démarré la session.
			<br />
			Le protocole de récupération débutera dès le lancement.
		</p>

		<div class="loading-status">
			<span class="status-dot"></span>
			<span class="status-label">Connexion au système… en attente du signal</span>
		</div>
	</div>
</div>

<style>
	.loading-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 70vh;
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.loading-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 520px;
		padding: var(--spacing-2xl, 40px);
	}

	/* Anneau de chargement */
	.loading-ring {
		position: relative;
		width: 84px;
		height: 84px;
		margin-bottom: var(--spacing-xl, 32px);
		border-radius: 50%;
		border: 3px solid var(--border-color, #1e293b);
		border-top-color: var(--accent-cyan, #00e5ff);
		animation: spin 1.1s linear infinite;
	}

	.ring-core {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--accent-cyan, #00e5ff);
		box-shadow: 0 0 14px var(--accent-cyan, #00e5ff);
		transform: translate(-50%, -50%);
		animation: pulse 1.6s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.4;
			transform: translate(-50%, -50%) scale(0.7);
		}
	}

	.loading-eyebrow {
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-muted, #64748b);
		margin: 0 0 var(--spacing-sm, 12px) 0;
	}

	.loading-title {
		font-size: 32px;
		font-weight: 700;
		color: var(--accent-cyan, #00e5ff);
		margin: 0 0 var(--spacing-md, 16px) 0;
		letter-spacing: -0.01em;
	}

	.loading-text {
		font-size: 15px;
		line-height: 1.7;
		color: var(--text-secondary, #94a3b8);
		margin: 0 0 var(--spacing-xl, 32px) 0;
	}

	.loading-status {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		background: var(--bg-panel, #111827);
		border: 1px solid var(--border-color, #1e293b);
		border-radius: var(--radius, 8px);
	}

	.status-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--accent-orange, #ffa500);
		box-shadow: 0 0 8px var(--accent-orange, #ffa500);
		animation: blink 1.3s ease-in-out infinite;
		flex-shrink: 0;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.25;
		}
	}

	.status-label {
		font-family: var(--font-mono, monospace);
		font-size: 12px;
		color: var(--text-secondary, #94a3b8);
	}

	@media (max-width: 768px) {
		.loading-title {
			font-size: 24px;
		}

		.loading-text {
			font-size: 14px;
		}
	}
</style>
