// Server action pour le login GM
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyGMPassword, createGMSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { password: string };
	
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}
	
	if (!body.password) {
		throw error(400, 'Password required');
	}
	
	// Vérifier le mot de passe
	if (!verifyGMPassword(body.password)) {
		return json({ error: 'Mot de passe incorrect' }, { status: 401 });
	}
	
	// Créer la session
	const event = { cookies } as any; // Simplification pour createGMSession
	createGMSession(event);
	
	return json({ success: true });
};
