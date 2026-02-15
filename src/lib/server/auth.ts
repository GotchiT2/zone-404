// Utilitaires d'authentification
import type { RequestEvent } from '@sveltejs/kit';
import { GM_PASSWORD, DEVICE_API_KEY, NODE_ENV } from "$env/static/private";

const GM_SESSION_COOKIE = 'gm_session';
const SESSION_SECRET = 'gm_authenticated'; // En production, utiliser un secret signé

/**
 * Vérifie si la requête a une session GM valide
 */
export function isGMAuthenticated(event: RequestEvent): boolean {
	const cookie = event.cookies.get(GM_SESSION_COOKIE);
	return cookie === SESSION_SECRET;
}

/**
 * Crée une session GM
 */
export function createGMSession(event: RequestEvent): void {
	event.cookies.set(GM_SESSION_COOKIE, SESSION_SECRET, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 jours
	});
}

/**
 * Détruit la session GM
 */
export function destroyGMSession(event: RequestEvent): void {
	event.cookies.delete(GM_SESSION_COOKIE, { path: '/' });
}

/**
 * Vérifie le mot de passe GM
 */
export function verifyGMPassword(password: string): boolean {
	const gmPassword = GM_PASSWORD;
	if (!gmPassword) {
		throw new Error('GM_PASSWORD not configured');
	}
	return password === gmPassword;
}

/**
 * Vérifie le token API device (Bearer token)
 */
export function verifyDeviceAPIKey(authHeader: string | null): boolean {
	console.log('🔍 authHeader reçu:', authHeader);
	console.log('🔑 DEVICE_API_KEY attendu:', DEVICE_API_KEY);
	if (!authHeader) return false;
	
	const deviceApiKey = DEVICE_API_KEY;
	if (!deviceApiKey) {
		throw new Error('DEVICE_API_KEY not configured');
	}
	
	const match = authHeader.match(/^Bearer (.+)$/);
	if (!match) return false;
	
	return match[1] === deviceApiKey;
}
