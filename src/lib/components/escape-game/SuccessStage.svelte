<script>
	export let roomName;
	// Temps restant dans la partie au moment de la validation finale (ex: "12:34")
	export let remainingTime = null;
</script>

<div class="success-stage">
	<!-- Hero section -->
	<div class="hero-box">
		<div class="success-icon">✓</div>
		<h2 class="hero-title">Mission accomplie</h2>
		<p class="hero-subtitle">
			Vous avez réussi à synthétiser l'antidote du virus Vaïk-17
		</p>

		<div class="hero-divider"></div>

		<!-- Temps restant au moment de la validation -->
		<div class="time-box">
			<span class="time-label">Temps restant à la validation</span>
			<span class="time-value">{remainingTime ?? '--:--'}</span>
		</div>
	</div>
</div>

<style>
	.success-stage {
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
		background: rgba(63, 185, 80, 0.1);
		border: 2px solid rgba(63, 185, 80, 0.3);
		border-radius: 6px;
	}

	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		margin-bottom: 1.5rem;
		background: rgba(63, 185, 80, 0.2);
		border: 2px solid #3fb950;
		border-radius: 50%;
		font-size: 3rem;
		color: #3fb950;
	}

	.hero-title {
		font-size: 2rem;
		font-weight: 700;
		color: #3fb950;
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
		background: linear-gradient(90deg, transparent, #3fb950, transparent);
		margin: 0 auto 1.5rem;
	}

	/* Temps restant */
	.time-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem 2rem;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(63, 185, 80, 0.3);
		border-radius: 6px;
		max-width: 360px;
		margin: 0 auto;
	}

	.time-label {
		font-size: 0.8125rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #7d8590;
		font-weight: 600;
	}

	.time-value {
		font-family: 'JetBrains Mono', 'Courier New', monospace;
		font-size: 3rem;
		font-weight: 700;
		line-height: 1;
		color: #3fb950;
		font-variant-numeric: tabular-nums;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.hero-box {
			padding: 2rem 1.5rem;
		}

		.hero-title {
			font-size: 1.5rem;
		}

		.success-icon {
			width: 64px;
			height: 64px;
			font-size: 2rem;
		}

		.time-value {
			font-size: 2.25rem;
		}
	}
</style>
