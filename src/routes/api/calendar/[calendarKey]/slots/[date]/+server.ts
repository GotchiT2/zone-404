import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createFreeSlotsForDate, getAvailableSlotsForDateAllCalendars } from '$lib/server/calendar';

export const POST: RequestHandler = async ({ params }) => {
	const { calendarKey, date } = params;

	try {
		const slots = await createFreeSlotsForDate(calendarKey, date);
		return json(slots, { status: 201 });
	} catch (err: any) {
		console.error('Erreur création slots libres', err);
		const status = err.status ?? 500;
		return json({ error: err.message ?? 'Erreur serveur' }, { status });
	}
};

export const GET: RequestHandler = async ({ params }) => {
	const { date } = params;

	try {
		const slots = await getAvailableSlotsForDateAllCalendars(date);
		return json(slots);
	} catch (err: any) {
		console.error('Erreur /api/calendar/slots/[date]', err);
		const status = err.status ?? 500;
		return json({ error: err.message ?? 'Erreur serveur' }, { status });
	}
};
