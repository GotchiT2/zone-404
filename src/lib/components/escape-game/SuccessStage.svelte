<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let roomName;
	export let completionTime = null;
	
	function handleRestart() {
		dispatch('restart');
	}
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
		<p class="hero-message">
			L'humanité peut enfin espérer un avenir. Grâce à votre travail,
			votre esprit d'analyse et votre coordination exceptionnelle,
			des millions de vies vont être sauvées.
		</p>
	</div>
	
	<!-- Stats grid -->
	<div class="stats-grid">
		<!-- Summary -->
		<div class="stat-card">
			<h3 class="card-title">
				<span class="card-icon">📊</span>
				Récapitulatif
			</h3>
			<div class="stat-items">
				<div class="stat-item">
					<span class="stat-label">Salle</span>
					<span class="stat-value">{roomName}</span>
				</div>
				{#if completionTime}
					<div class="stat-item">
						<span class="stat-label">Temps total</span>
						<span class="stat-value">{completionTime}</span>
					</div>
				{/if}
				<div class="stat-item">
					<span class="stat-label">Étapes complétées</span>
					<span class="stat-value stat-success">2/2 ✓</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Statut final</span>
					<span class="stat-value stat-success">✓ Réussi</span>
				</div>
			</div>
		</div>
		
		<!-- Achievements -->
		<div class="stat-card">
			<h3 class="card-title">
				<span class="card-icon">🏆</span>
				Réalisations
			</h3>
			<div class="achievement-items">
				<div class="achievement-item">
					<span class="achievement-icon">✓</span>
					<span class="achievement-text">Bug système corrigé</span>
				</div>
				<div class="achievement-item">
					<span class="achievement-icon">✓</span>
					<span class="achievement-text">10 composants identifiés</span>
				</div>
				<div class="achievement-item">
					<span class="achievement-icon">✓</span>
					<span class="achievement-text">Formule reconstituée</span>
				</div>
				<div class="achievement-item">
					<span class="achievement-icon">✓</span>
					<span class="achievement-text">Antidote synthétisé</span>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Lab report -->
	<div class="report-box">
		<h3 class="report-title">
			<span class="report-icon">🔬</span>
			Rapport du Laboratoire Vaïk-17
		</h3>
		<div class="report-content">
			<p class="report-text">
				"L'équipe a fait preuve d'une remarquable capacité d'analyse et de déduction.
				La correction du système défaillant a été effectuée avec précision, et la
				reconstitution de la formule de l'antidote démontre une excellente coordination.
				Les tests préliminaires confirment l'efficacité à 99,6% du sérum synthétisé.
				Ce résultat exceptionnel marque un tournant décisif dans la lutte contre le virus Vaïk-17.
				L'humanité vous doit une dette immense."
			</p>
			<p class="report-author">
				— Dr. Sarah Chen, Directrice du Projet Vaïk-17
			</p>
		</div>
	</div>
	
	<!-- Actions -->
	<div class="actions">
		<button on:click={handleRestart} class="btn-primary">
			<span class="btn-icon">🔄</span>
			Recommencer l'expérience
		</button>
		
		<button on:click={() => window.print()} class="btn-secondary">
			<span class="btn-icon">🖨️</span>
			Imprimer le rapport
		</button>
	</div>
	
	<!-- Footer message -->
	<div class="footer-message">
		<p class="footer-text">Merci d'avoir participé à cette aventure !</p>
		<p class="footer-subtext">Votre progression a été sauvegardée automatiquement.</p>
	</div>
</div>

<style>
	.success-stage {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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
	
	.hero-message {
		max-width: 600px;
		margin: 0 auto;
		color: #c9d1d9;
		font-size: 0.9375rem;
		line-height: 1.7;
	}
	
	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}
	
	.stat-card {
		background: rgba(13, 17, 23, 0.6);
		border: 1px solid rgba(48, 54, 61, 0.8);
		border-radius: 6px;
		padding: 1.5rem;
	}
	
	.card-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #e6edf3;
		margin-bottom: 1rem;
	}
	
	.card-icon {
		font-size: 1.25rem;
	}
	
	.stat-items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.stat-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid rgba(48, 54, 61, 0.5);
	}
	
	.stat-item:last-child {
		border-bottom: none;
	}
	
	.stat-label {
		font-size: 0.875rem;
		color: #7d8590;
		font-weight: 600;
	}
	
	.stat-value {
		font-size: 0.875rem;
		color: #58a6ff;
		font-weight: 600;
	}
	
	.stat-success {
		color: #3fb950;
	}
	
	.achievement-items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.achievement-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
	}
	
	.achievement-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		font-size: 0.875rem;
		color: #3fb950;
	}
	
	.achievement-text {
		font-size: 0.875rem;
		color: #c9d1d9;
	}
	
	/* Lab report */
	.report-box {
		background: rgba(13, 17, 23, 0.6);
		border: 1px solid rgba(48, 54, 61, 0.8);
		border-radius: 6px;
		padding: 1.5rem;
	}
	
	.report-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #e6edf3;
		margin-bottom: 1rem;
	}
	
	.report-icon {
		font-size: 1.25rem;
	}
	
	.report-content {
		background: rgba(0, 0, 0, 0.3);
		border-left: 3px solid #3fb950;
		border-radius: 4px;
		padding: 1.25rem;
	}
	
	.report-text {
		color: #c9d1d9;
		font-size: 0.875rem;
		line-height: 1.7;
		font-style: italic;
		margin-bottom: 1rem;
	}
	
	.report-author {
		font-size: 0.75rem;
		color: #7d8590;
		text-align: right;
	}
	
	/* Actions */
	.actions {
		display: flex;
		gap: 1rem;
	}
	
	.btn-primary,
	.btn-secondary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.btn-primary {
		flex: 1;
		background: #1f6feb;
		color: white;
	}
	
	.btn-primary:hover {
		background: #1a5ccc;
	}
	
	.btn-secondary {
		background: rgba(48, 54, 61, 0.8);
		color: #e6edf3;
	}
	
	.btn-secondary:hover {
		background: rgba(48, 54, 61, 1);
	}
	
	.btn-icon {
		font-size: 1.125rem;
	}
	
	/* Footer */
	.footer-message {
		text-align: center;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(48, 54, 61, 0.5);
	}
	
	.footer-text {
		font-size: 0.875rem;
		color: #7d8590;
		margin-bottom: 0.5rem;
	}
	
	.footer-subtext {
		font-size: 0.75rem;
		color: rgba(125, 133, 144, 0.6);
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
		
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.actions {
			flex-direction: column;
		}
	}
</style>