<svelte:options customElement="salle-card" />

<script lang="ts">
	import { Card } from 'flowbite-svelte';

	type Slot = {
		id: string;
		title: string;
		description: string;
		img: string;
		start: string;
		end: string;
		loading?: boolean;
	};

	const { roomLabel, description, img, slots, onSelectSlot, loading } = $props<{
		roomLabel: string;
		slots: Slot[];
		onSelectSlot: (slot: Slot) => void
	}>();

	function formatTime(iso: string): string {
		if (!iso) return '';
		const date = new Date(iso);
		return date.toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleClick(slot: Slot) {
		onSelectSlot(slot);
	}
</script>

<Card {img}>
	<div class="m-6">
		<a href="">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{roomLabel}</h5>
		</a>

		<p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">{description}</p>

		{#if loading}
			<p class="empty">Chargement des créneaux...</p>
		{:else if !slots || slots.length === 0}
			<p class="empty">Aucun créneau libre pour cette salle.</p>
		{:else}
			<ul class="slots">
				{#each slots as slot}
					<li class="slot">
						<button type="button" onclick={() => handleClick(slot)}>
							{formatTime(slot.start)}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</Card>

<style>
    .slots {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .slot button {
        border: 1px solid #ccc;
        border-radius: 999px;
        padding: 0.3rem 0.8rem;
        background: #f9f9f9;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .slot button:hover {
        background: #eee;
    }

    .empty {
        font-size: 0.9rem;
        color: #777;
				font-style: italic;
    }
</style>