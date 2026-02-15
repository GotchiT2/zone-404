// Utilitaires pour le calcul précis du timer
import type { RunTimer, TimerState } from '@prisma/client';

/**
 * Calcule le temps restant (en ms) pour un timer donné
 * Prend en compte les pauses et l'état du timer
 */
export function calculateRemainingMs(timer: RunTimer): number {
	const now = Date.now();
	
	switch (timer.state) {
		case 'IDLE':
			// Timer pas encore démarré : durée complète
			return timer.durationMs;
			
		case 'RUNNING':
			// Timer en cours : calculer le temps écoulé
			if (!timer.startedAt) return timer.durationMs;
			
			const elapsed = now - timer.startedAt.getTime();
			const remaining = timer.durationMs - elapsed + timer.accumulatedPausedMs;
			return Math.max(0, remaining);
			
		case 'PAUSED':
			// Timer en pause : calculer jusqu'au moment de la pause
			if (!timer.startedAt || !timer.pausedAt) return timer.durationMs;
			
			const elapsedBeforePause = timer.pausedAt.getTime() - timer.startedAt.getTime();
			const remainingAtPause = timer.durationMs - elapsedBeforePause + timer.accumulatedPausedMs;
			return Math.max(0, remainingAtPause);
			
		case 'ENDED':
			// Timer terminé
			return 0;
			
		default:
			return timer.durationMs;
	}
}

/**
 * Convertit un timer DB en objet pour l'API
 */
export function timerToJSON(timer: RunTimer) {
	return {
		runId: timer.runId,
		state: timer.state,
		durationMs: timer.durationMs,
		remainingMs: calculateRemainingMs(timer),
		updatedAt: timer.updatedAt.toISOString()
	};
}

/**
 * Convertit un timer DB en format pour les événements SSE display
 */
export function timerToDisplayEvent(timer: RunTimer) {
	const remainingMs = calculateRemainingMs(timer);
	const serverNow = new Date().toISOString();
	
	let endsAt: string | null = null;
	if (timer.state === 'RUNNING') {
		endsAt = new Date(Date.now() + remainingMs).toISOString();
	}
	
	return {
		status: timer.state,
		remainingMs,
		endsAt,
		serverNow
	};
}

/**
 * Formate un temps en ms en format lisible (mm:ss ou hh:mm:ss)
 */
export function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	
	if (hours > 0) {
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
	
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
