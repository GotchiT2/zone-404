<script lang="ts">
	import { Heading, GradientButton, Spinner } from 'flowbite-svelte';
	import { Footer, FooterLinkGroup, FooterLink, FooterIcon, FooterCopyright } from "flowbite-svelte";
	import { FacebookSolid, InstagramSolid } from "flowbite-svelte-icons";
	import SalleCard from '$lib/components/SalleCard.svelte';
	import Header from '$lib/components/Header.svelte';
	type CalendarKey = 'salle1' | 'salle2' | 'salle3';

	type SlotWithCalendar = {
		id: string;
		title: string;
		start: string;
		end: string;
		calendar: CalendarKey;
	};

	let selectedDate = $state('');
	let allSlots = $state<SlotWithCalendar[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function fetchSlots(date: string) {
		loading = true;
		error = null;
		try {
			const res = await fetch(`/api/calendar/slots/${date}`);
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || 'Erreur lors du chargement des créneaux');
			}
			allSlots = await res.json();
		} catch (e) {
			error = (e as Error).message;
			allSlots = [];
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (!selectedDate) {
			allSlots = [];
			return;
		}
		fetchSlots(selectedDate);
	});

	let slotsSalle1 = $derived(allSlots.filter((s) => s.calendar === 'salle1'));
	let slotsSalle2 = $derived(allSlots.filter((s) => s.calendar === 'salle2'));
	let slotsSalle3 = $derived(allSlots.filter((s) => s.calendar === 'salle3'));

	function handleSelectSlot(slot: any) {
		console.log('Créneau sélectionné :', slot);
		// ici tu peux ouvrir un modal de réservation par ex.
	}
</script>

<Header/>

<div class="w-full relative">
	<video class="w-full mask-b-from-60% mask-b-to-100% " src="/plop.webm" autoplay playsinline loop></video>
	<div class="absolute top-0 w-full h-full bg-[#00000080] flex items-center justify-center flex-col gap-4 p-4 text-center">
		<Heading
			tag="h1"
			class="text-white dark:text-primary-500"
		>
			Zone404
		</Heading>

		<Heading
			tag="h2"
			class="text-white dark:text-primary-500 text-lg"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.
		</Heading>

		<GradientButton outline color="cyanToBlue" class="cursor-pointer">Cyan to Blue</GradientButton>
	</div>
</div>

<section class="bg-black p-8">

	<div class="flex flex-col items-center justify-center gap-4 mb-8">
		<Heading
			tag="h2"
			class="text-white dark:text-primary-500 text-5xl mb-8"
		>
			Planning des salles
		</Heading>

		<label class="text-white">
			{#if loading}
				<Spinner color="blue" />
			{/if}
			Sélectionnez une date :
			<input
				type="date"
				bind:value={selectedDate}
				class="bg-transparent border border-white rounded px-2 py-1 ml-2 text-white"
			/>
		</label>
	</div>

	<div class="flex mx-auto w-full justify-center gap-8 mb-16">
		<SalleCard
			roomLabel="Escape Kids : À la recherche du trésor de la jungle"
			description="Plongez vos enfants dans un escape game jungle ludique et immersif ! En équipe de 2 à 6, les explorateurs de moins de 8 ans devront résoudre de petites énigmes et retrouver le trésor caché. Une aventure idéale pour une première expérience d’escape game."
			img="/escape-kids-thumbnail.png"
			slots={slotsSalle1}
			{loading}
			onSelectSlot={handleSelectSlot}
		/>

		<SalleCard
			roomLabel="Le Tatoueur Maudit : enquête dans un cabinet inquiétant"
			description="Osez ce escape game thriller pour 2 à 6 joueurs à partir de 16 ans. Fouillez le cabinet d’un tatoueur dérangé, rassemblez les preuves d’une série de meurtres et effacez toute trace de votre passage. Une enquête intense pour amateurs de sensations fortes."
			img="/tatoueur-thumbnail.png"
			slots={slotsSalle2}
			{loading}
			onSelectSlot={handleSelectSlot}
		/>

		<SalleCard
			roomLabel="Le Laboratoire de l’Extinction"
			description="Dans ce escape game futuriste, vous êtes les derniers espoirs de l’humanité. Explorez un laboratoire abandonné, analysez les indices et reconstituez l’antidote du virus qui a décimé 99,6 % de la population. Survivrez-vous… ou succomberez comme les autres ?"
			img="/labo-thumbnail.png"
			slots={slotsSalle3}
			{loading}
			onSelectSlot={handleSelectSlot}
		/>
	</div>
</section>

<Footer footerType="sitemap">
	<div class="grid grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
		<div>
			<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase">Zone404</h2>
			<FooterLinkGroup class="text-gray-900 dark:text-gray-200">
				<FooterLink class="mb-4" href="/">Qui sommes nous ?</FooterLink>
				<FooterLink class="mb-4" href="/">Le concept</FooterLink>
				<FooterLink class="mb-4" href="/">Réserver une session</FooterLink>
			</FooterLinkGroup>
		</div>
		<div>
			<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase">Infos pratiques</h2>
			<FooterLinkGroup class="text-gray-900 dark:text-gray-200">
				<FooterLink class="mb-4" href="/">Où nous trouver ?</FooterLink>
				<FooterLink class="mb-4" href="/">Horaires d'ouverture</FooterLink>
				<FooterLink class="mb-4" href="/">Carte du bar</FooterLink>
			</FooterLinkGroup>
		</div>
	</div>
	<div class="bg-gray-100 px-4 py-6 md:flex md:items-center md:justify-between dark:bg-gray-700">
		<FooterCopyright class="text-sm text-gray-900 sm:text-center dark:text-gray-200" href="/" by="Zone404™" />
		<div class="mt-4 flex space-x-6 sm:justify-center md:mt-0 rtl:space-x-reverse">
			<FooterIcon href="/">
				<FacebookSolid class="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" />
			</FooterIcon>
			<FooterIcon href="/">
				<InstagramSolid class="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" />
			</FooterIcon>
		</div>
	</div>
</Footer>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }


    @keyframes animateGrain{
        0%, 100% { transform:translate(0, 0) }
        10%{
            transform:translate(-5%,-10%)
        }
        20%{
            transform:translate(-15%,-20%)
        }
        30%{
            transform:translate(-5%,-10%)
        }
        40%{
            transform:translate(-15%,-20%)
        }

        50%{
            transform:translate(-5%,-10%)
        }
        60%{
            transform:translate(-15%,-20%)
        }
        70%{
            transform:translate(-5%,-10%)
        }
        80%{
            transform:translate(-15%,-20%)
        }
        90%{
            transform:translate(-5%,-10%)
        }
        100%{
            transform:translate(-15%,-20%)
        }

    }
</style>



