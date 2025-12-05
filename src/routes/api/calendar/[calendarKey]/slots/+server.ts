import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAvailableSlots } from '$lib/server/calendar';

export const GET: RequestHandler = async ({ params }) => {
	const { calendarKey } = params;
	console.log('GET /slots for calendarKey=', calendarKey);

	try {
		const slots = await getAvailableSlots(calendarKey);
		console.log(`Slots disponibles pour ${calendarKey} :`, slots);
		return json(slots);
	} catch (err: any) {
		console.error('Erreur /slots', err);
		const status = err.status ?? 500;
		return json({ error: err.message ?? 'Erreur serveur' }, { status });
	}
};
