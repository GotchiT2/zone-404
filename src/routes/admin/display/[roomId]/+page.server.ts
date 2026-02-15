// Server-side data loader for display page
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { roomId } = params;
	
	return {
		roomId
	};
};
