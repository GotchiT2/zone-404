// Server action pour le logout GM
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { destroyGMSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	// Détruire la session
	const event = { cookies } as any;
	destroyGMSession(event);
	
	return json({ success: true });
};
