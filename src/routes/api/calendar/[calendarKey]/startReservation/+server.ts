import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { startReservation } from "$lib/server/calendar";

export const POST: RequestHandler = async ({ params, request }) => {
  const { calendarKey } = params;

  const body = await request.json().catch(() => null);
  const slotId = body?.slotId as string | undefined;
  const players = Number(body?.players);

  if (!slotId || !Number.isFinite(players)) {
    return json({ error: "slotId ou players manquant(s)" }, { status: 400 });
  }

  try {
    const slot = await startReservation(calendarKey, slotId, players);
    return json(slot, { status: 200 });
  } catch (err: any) {
    console.error("Erreur startReservation", err);
    const status = err.status ?? 500;
    return json({ error: err.message ?? "Erreur serveur" }, { status });
  }
};
