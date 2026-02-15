// Gestion des messages actifs pour les displays
// Store en mémoire des messages actifs par salle

const activeMessages = new Map<string, { text: string; sentAt: Date; activeUntil: Date }>();

export function getActiveMessage(roomId: string) {
	const msg = activeMessages.get(roomId);
	if (!msg) return null;
	
	// Vérifier si le message est encore actif
	if (new Date() > msg.activeUntil) {
		activeMessages.delete(roomId);
		return null;
	}
	
	return msg;
}

export function setActiveMessage(roomId: string, text: string) {
	const now = new Date();
	const activeUntil = new Date(now.getTime() + 30000); // 30 secondes
	
	activeMessages.set(roomId, {
		text,
		sentAt: now,
		activeUntil
	});
	
	// Auto-cleanup après 30 secondes
	setTimeout(() => {
		const current = activeMessages.get(roomId);
		if (current && current.sentAt === now) {
			activeMessages.delete(roomId);
		}
	}, 30000);
}
