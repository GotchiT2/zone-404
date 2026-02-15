// Types pour les événements SSE de la page Display

export type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'ENDED';

export interface TimerStateEvent {
	status: TimerState;
	remainingMs: number;
	endsAt: string | null; // ISO timestamp when timer ends (if RUNNING)
	serverNow: string; // ISO timestamp of server time
}

export interface MessageStateEvent {
	text: string | null; // null if no active message
	activeUntil: string | null; // ISO timestamp when message overlay should end
	sentAt: string | null; // ISO timestamp when message was sent
}

export interface MessageCreatedEvent {
	text: string;
	sentAt: string; // ISO timestamp
}

export type DisplaySSEEvent = 
	| { type: 'timer_state'; data: TimerStateEvent }
	| { type: 'message_state'; data: MessageStateEvent }
	| { type: 'message_created'; data: MessageCreatedEvent };
