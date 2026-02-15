// Hooks serveur pour gérer l'authentification
import type { Handle } from "@sveltejs/kit";
import { isGMAuthenticated } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  // Vérifier l'authentification GM
  event.locals.isGMAuthenticated = isGMAuthenticated(event);

  // Protéger les routes /gm/* (sauf /gm/login)
  if (
    event.url.pathname.startsWith("/gm") &&
    !event.url.pathname.startsWith("/gm/login")
  ) {
    if (!event.locals.isGMAuthenticated) {
      return new Response("Redirect", {
        status: 303,
        headers: { Location: "/gm/login" },
      });
    }
  }

  return resolve(event);
};
