import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { holdSlot } from '$lib/server/calendar';

export const POST: RequestHandler = async ({ params, request }) => {
	const { calendarKey } = params;

	const body = await request.json().catch(() => null);
	const slotId = body?.slotId as string | undefined;

	if (!slotId) {
		return json({ error: 'slotId manquant' }, { status: 400 });
	}

	try {
		const slot = await holdSlot(calendarKey, slotId);
		return json(slot, { status: 200 });
	} catch (err: any) {
		console.error('Erreur holdSlot', err);
		const status = err.status ?? 500;
		return json({ error: err.message ?? 'Erreur serveur' }, { status });
	}
};