// Gestionnaire SSE pour les mises à jour temps réel
type SSEClient = {
	controller: ReadableStreamDefaultController;
	roomId: string;
};

// Map des clients connectés par roomId
const clients = new Map<string, Set<SSEClient>>();

/**
 * Ajoute un client SSE pour une salle donnée
 */
export function addSSEClient(roomId: string, controller: ReadableStreamDefaultController) {
	if (!clients.has(roomId)) {
		clients.set(roomId, new Set());
	}
	
	const client: SSEClient = { controller, roomId };
	clients.get(roomId)!.add(client);
	
	console.log(`[SSE] Client connected to room ${roomId}. Total clients: ${clients.get(roomId)!.size}`);
	
	return client;
}

/**
 * Retire un client SSE
 */
export function removeSSEClient(client: SSEClient) {
	const roomClients = clients.get(client.roomId);
	if (roomClients) {
		roomClients.delete(client);
		console.log(`[SSE] Client disconnected from room ${client.roomId}. Remaining: ${roomClients.size}`);
		
		if (roomClients.size === 0) {
			clients.delete(client.roomId);
		}
	}
}

/**
 * Envoie un événement SSE à tous les clients d'une salle
 */
export function broadcastToRoom(roomId: string, event: string, data: any) {
	const roomClients = clients.get(roomId);
	if (!roomClients) return;
	
	const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
	const encoder = new TextEncoder();
	const encoded = encoder.encode(message);
	
	// Envoyer à tous les clients de cette salle
	for (const client of roomClients) {
		try {
			client.controller.enqueue(encoded);
		} catch (error) {
			console.error(`[SSE] Error sending to client:`, error);
			removeSSEClient(client);
		}
	}
	
	console.log(`[SSE] Broadcast "${event}" to ${roomClients.size} client(s) in room ${roomId}`);
}

/**
 * Crée un stream SSE pour une salle
 */
export function createSSEStream(roomId: string) {
	let client: SSEClient | null = null;
	
	const stream = new ReadableStream({
		start(controller) {
			// Ajouter le client
			client = addSSEClient(roomId, controller);
			
			// Envoyer un message de connexion
			const encoder = new TextEncoder();
			controller.enqueue(encoder.encode(`: connected\n\n`));
		},
		cancel() {
			// Retirer le client quand la connexion est fermée
			if (client) {
				removeSSEClient(client);
			}
		}
	});
	
	return stream;
}
