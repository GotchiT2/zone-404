<script>
	export let roomName;
	// Reason for defeat: 'time' (timer expired) or 'population' (0 survivors)
	export let reason = 'time';
	// Stats
	export let survivors = null;
	export let errorCount = null;
</script>

<div class="defeat-stage">
	<!-- Hero section -->
	<div class="hero-box">
		<div class="defeat-icon">✕</div>
		<h2 class="hero-title">Mission échouée</h2>
		<p class="hero-subtitle">
			{#if reason === 'population'}
				La population mondiale a été décimée. Il n'y a plus de survivants.
			{:else}
				Le temps est écoulé. L'antidote n'a pas pu être synthétisé à temps.
			{/if}
		</p>

		<div class="hero-divider"></div>

		<div class="cause-box">
			<span class="cause-label">Cause de l'échec</span>
			<span class="cause-value">
				{#if reason === 'population'}
					EXTINCTION DE LA POPULATION
				{:else}
					TEMPS ÉCOULÉ
				{/if}
			</span>
		</div>

		<!-- Stats de la partie -->
		{#if survivors !== null || errorCount !== null}
			<div class="stats-box">
				{#if survivors !== null}
					<div class="stat-item">
						<span class="stat-label">Survivants</span>
						<span class="stat-value survivors">{Number(survivors).toLocaleString('fr-FR')}</span>
					</div>
				{/if}
				{#if errorCount !== null}
					<div class="stat-item">
						<span class="stat-label">Erreurs commises</span>
						<span class="stat-value errors">{errorCount}</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.defeat-stage {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 640px;
		margin: 0 auto;
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Hero section */
	.hero-box {
		text-align: center;
		padding: 3rem 2rem;
		background: rgba(255, 77, 77, 0.1);
		border: 2px solid rgba(255, 77, 77, 0.3);
		border-radius: 6px;
	}

	.defeat-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		margin-bottom: 1.5rem;
		background: rgba(255, 77, 77, 0.2);
		border: 2px solid #ff4d4d;
		border-radius: 50%;
		font-size: 3rem;
		color: #ff4d4d;
		animation: defeatPulse 2s ease-in-out infinite;
	}

	@keyframes defeatPulse {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.4);
		}
		50% {
			box-shadow: 0 0 30px 10px rgba(255, 77, 77, 0.2);
		}
	}

	.hero-title {
		font-size: 2rem;
		font-weight: 700;
		color: #ff4d4d;
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hero-subtitle {
		font-size: 1.125rem;
		color: #e6edf3;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.hero-divider {
		width: 80px;
		height: 2px;
		background: linear-gradient(90deg, transparent, #ff4d4d, transparent);
		margin: 0 auto 1.5rem;
	}

	/* Cause box */
	.cause-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem 2rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 77, 77, 0.3);
		border-radius: 6px;
		max-width: 360px;
		margin: 0 auto;
	}

	.cause-label {
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #7d8590;
		font-weight: 600;
	}

	.cause-value {
		font-family: 'JetBrains Mono', 'Courier New', monospace;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1;
		color: #ff4d4d;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Stats box */
	.stats-box {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 77, 77, 0.2);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.stat-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #7d8590;
		font-weight: 600;
	}

	.stat-value {
		font-family: 'JetBrains Mono', 'Courier New', monospace;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.stat-value.survivors {
		color: #ff7b72;
	}

	.stat-value.errors {
		color: #ffa657;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.hero-box {
			padding: 2rem 1.5rem;
		}

		.hero-title {
			font-size: 1.5rem;
		}

		.defeat-icon {
			width: 64px;
			height: 64px;
			font-size: 2rem;
		}

		.cause-value {
			font-size: 1rem;
		}

		.stats-box {
			grid-template-columns: 1fr;
		}

		.stat-value {
			font-size: 1.25rem;
		}
	}
</style>