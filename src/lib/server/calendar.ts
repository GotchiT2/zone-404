// src/lib/server/calendar.ts
import { google, calendar_v3 } from 'googleapis';
import path from 'path';
import {
	GOOGLE_CALENDAR_SALLE1_ID,
	GOOGLE_CALENDAR_SALLE2_ID,
	GOOGLE_CALENDAR_SALLE3_ID,
	GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
} from '$env/static/private';

const calendarIds: Record<CalendarKey, string> = {
	salle1: GOOGLE_CALENDAR_SALLE1_ID,
	salle2: GOOGLE_CALENDAR_SALLE2_ID,
	salle3: GOOGLE_CALENDAR_SALLE3_ID
};

export type CalendarKey = 'salle1' | 'salle2' | 'salle3';

export type Slot = {
	id: string;
	title: string;
	start: string;
	end: string;
};

export type SlotWithCalendar = Slot & {
	calendar: CalendarKey;
};

export type CreateReservationInput = {
	slotId: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	participants: number;
};

function getCalendarIdOrThrow(calendarKey: string): string {
	if (!['salle1', 'salle2', 'salle3'].includes(calendarKey)) {
		throw Object.assign(new Error(`Calendrier inconnu : ${calendarKey}`), {
			status: 400,
		});
	}
	const id = calendarIds[calendarKey as CalendarKey];
	if (!id) {
		throw Object.assign(
			new Error(`ID de calendrier introuvable pour ${calendarKey}`),
			{ status: 500 },
		);
	}
	return id;
}

function getCalendarClient(): calendar_v3.Calendar {
	const keyPath = GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './config/service-account.json';
	const absoluteKeyPath = path.resolve(keyPath);

	const auth = new google.auth.GoogleAuth({
		keyFile: absoluteKeyPath,
		scopes: ['https://www.googleapis.com/auth/calendar'],
	});

	return google.calendar({ version: 'v3', auth });
}

const calendar = getCalendarClient();

// ========== 1) LISTER LES SLOTS LIBRES ==========
export async function getAvailableSlots(calendarKey: string): Promise<Slot[]> {
	const calendarId = getCalendarIdOrThrow(calendarKey);

	const now = new Date().toISOString();

	const response = await calendar.events.list({
		calendarId,
		timeMin: now,
		singleEvents: true,
		orderBy: 'startTime',
	});

	const events = response.data.items ?? [];

	return events
		.filter(
			(event) =>
				!!event.id &&
				!!event.summary &&
				event.summary.startsWith('[LIBRE]'),
		)
		.map((event) => ({
			id: event.id as string,
			title: event.summary as string,
			start: event.start?.dateTime || event.start?.date || '',
			end: event.end?.dateTime || event.end?.date || '',
		}));
}

export async function getAvailableSlotsForDateAllCalendars(
	date: string,
): Promise<SlotWithCalendar[]> {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		const err = new Error(
			"Le paramètre date doit être au format YYYY-MM-DD (ex: 2025-11-20)",
		);
		(err as any).status = 400;
		throw err;
	}

	const calendar = getCalendarClient();

	// On définit les bornes de la journée
	// ici en Europe/Paris, mais pour simplifier on reste sur 00:00 - 23:59 du jour
	const timeMin = `${date}T00:00:00Z`;
	const timeMax = `${date}T23:59:59Z`;

	const entries = Object.entries(calendarIds) as [CalendarKey, string][];

	const results: SlotWithCalendar[] = [];

	// On interroge chaque agenda
	for (const [calendarKey, calendarId] of entries) {
		const response = await calendar.events.list({
			calendarId,
			timeMin,
			timeMax,
			singleEvents: true,
			orderBy: 'startTime',
		});

		const events = response.data.items ?? [];

		const slotsForCalendar: SlotWithCalendar[] = events
			.filter(
				(event) =>
					!!event.id &&
					!!event.summary &&
					event.summary.startsWith('[LIBRE]'),
			)
			.map((event) => ({
				calendar: calendarKey,
				id: event.id as string,
				title: event.summary as string,
				start: event.start?.dateTime || event.start?.date || '',
				end: event.end?.dateTime || event.end?.date || '',
			}));

		results.push(...slotsForCalendar);
	}

	return results;
}

// ========== 2) RÉSERVER UN SLOT ==========
export async function reserveSlot(
	calendarKey: string,
	input: CreateReservationInput,
): Promise<Slot> {
	const calendarId = getCalendarIdOrThrow(calendarKey);
	const { slotId, email, firstName, lastName, phone, participants } = input;

	const { data: event } = await calendar.events.get({
		calendarId,
		eventId: slotId,
	});

	if (!event) {
		throw Object.assign(new Error('Créneau introuvable'), { status: 404 });
	}

	const summary = event.summary ?? '';

	// On ne peut réserver que si le slot est marqué [LIBRE]
	if (!summary.startsWith('[LIBRE]')) {
		throw Object.assign(
			new Error('Ce créneau n’est pas libre ou est déjà réservé'),
			{ status: 409 },
		);
	}

	const baseDescription = event.description ? event.description + '\n\n' : '';
	const description =
		baseDescription +
		'--- Réservation ---\n' +
		`Nom : ${input.lastName}\n` +
		`Prénom : ${input.firstName}\n` +
		`Email : ${email}\n` +
		`Téléphone : ${phone}\n` +
		`Nombre de participants : ${participants}\n`;

	// Nouveau titre : [PAYE] Nom Prénom
	const newSummary = `[PAYE] ${input.lastName} ${input.firstName}`;

	const updatedEvent: calendar_v3.Schema$Event = {
		...event,
		summary: newSummary,
		description,
	};

	const { data: savedEvent } = await calendar.events.update({
		calendarId,
		eventId: slotId,
		requestBody: updatedEvent,
	});

	return {
		id: savedEvent.id as string,
		title: savedEvent.summary ?? '',
		start:
			savedEvent.start?.dateTime ||
			savedEvent.start?.date ||
			'',
		end:
			savedEvent.end?.dateTime ||
			savedEvent.end?.date ||
			'',
	};
}

// ========== 3) CRÉER DES SLOTS LIBRES POUR UNE DATE ==========
export async function createFreeSlotsForDate(
	calendarKey: string,
	date: string,
): Promise<Slot[]> {
	const calendarId = getCalendarIdOrThrow(calendarKey);

	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw Object.assign(
			new Error(
				"Le paramètre date doit être au format YYYY-MM-DD (ex: 2025-11-20)",
			),
			{ status: 400 },
		);
	}

	const slotsConfig = [
		{ start: '09:00:00', end: '10:30:00' },
		{ start: '10:30:00', end: '12:00:00' },
		{ start: '14:00:00', end: '15:30:00' },
		{ start: '15:30:00', end: '17:00:00' },
		{ start: '17:00:00', end: '18:30:00' },
	];

	const createdSlots: Slot[] = [];

	for (const slot of slotsConfig) {
		const eventBody: calendar_v3.Schema$Event = {
			summary: '[LIBRE]',
			start: {
				dateTime: `${date}T${slot.start}`,
				timeZone: 'Europe/Paris',
			},
			end: {
				dateTime: `${date}T${slot.end}`,
				timeZone: 'Europe/Paris',
			},
			description: 'Créneau libre pour réservation escape game',
		};

		const { data: createdEvent } = await calendar.events.insert({
			calendarId,
			requestBody: eventBody,
		});

		createdSlots.push({
			id: createdEvent.id as string,
			title: createdEvent.summary ?? '',
			start:
				createdEvent.start?.dateTime ||
				createdEvent.start?.date ||
				'',
			end:
				createdEvent.end?.dateTime ||
				createdEvent.end?.date ||
				'',
		});
	}

	return createdSlots;
}

export async function holdSlot(
	calendarKey: string,
	slotId: string
): Promise<SlotWithCalendar> {
	const calendarId = getCalendarIdOrThrow(calendarKey);

	const { data: event } = await calendar.events.get({
		calendarId,
		eventId: slotId
	});

	if (!event) {
		const err = new Error('Créneau introuvable');
		(err as any).status = 404;
		throw err;
	}

	const summary = event.summary ?? '';

	if (!summary.startsWith('[LIBRE]')) {
		const err = new Error('Ce créneau n’est pas libre (déjà réservé ou en cours)');
		(err as any).status = 409;
		throw err;
	}

	const updatedEvent: calendar_v3.Schema$Event = {
		...event,
		summary: '[EN COURS DE RESA]'
	};

	const { data: savedEvent } = await calendar.events.update({
		calendarId,
		eventId: slotId,
		requestBody: updatedEvent
	});

	return {
		calendar: calendarKey as CalendarKey,
		id: savedEvent.id as string,
		title: savedEvent.summary ?? '',
		start:
			savedEvent.start?.dateTime ||
			savedEvent.start?.date ||
			'',
		end:
			savedEvent.end?.dateTime ||
			savedEvent.end?.date ||
			''
	};
}

export async function releaseSlot(
	calendarKey: string,
	slotId: string
): Promise<void> {
	const calendarId = getCalendarIdOrThrow(calendarKey);

	const { data: event } = await calendar.events.get({
		calendarId,
		eventId: slotId
	});

	if (!event) {
		const err = new Error('Créneau introuvable');
		(err as any).status = 404;
		throw err;
	}

	const summary = event.summary ?? '';

	// On ne remet à [LIBRE] que si c’est en cours de resa
	if (!summary.startsWith('[EN COURS DE RESA]')) {
		return; // rien à faire
	}

	const updatedEvent: calendar_v3.Schema$Event = {
		...event,
		summary: '[LIBRE]'
	};

	await calendar.events.update({
		calendarId,
		eventId: slotId,
		requestBody: updatedEvent
	});
}
