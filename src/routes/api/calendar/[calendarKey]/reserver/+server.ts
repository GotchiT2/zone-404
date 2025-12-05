import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { reserveSlot, type CreateReservationInput } from '$lib/server/calendar';

export const POST: RequestHandler = async ({ params, request }) => {
	const { calendarKey } = params;

	let body: Partial<CreateReservationInput>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Body JSON invalide' }, { status: 400 });
	}

	const { slotId, email, firstName, lastName, phone, participants } = body;

	// mini validation
	if (
		!slotId ||
		!email ||
		!firstName ||
		!lastName ||
		!phone ||
		typeof participants !== 'number'
	) {
		return json({ error: 'Données manquantes ou invalides' }, { status: 400 });
	}

	try {
		const slot = await reserveSlot(calendarKey, {
			slotId,
			email,
			firstName,
			lastName,
			phone,
			participants,
		});
		return json(slot, { status: 201 });
	} catch (err: any) {
		console.error('Erreur /reserve', err);
		const status = err.status ?? 500;
		return json({ error: err.message ?? 'Erreur serveur' }, { status });
	}
};
