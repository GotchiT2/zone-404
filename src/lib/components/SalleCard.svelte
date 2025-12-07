<svelte:options customElement="salle-card"/>

<script lang="ts">
  type Slot = {
    id: string;
    title: string;
    description: string;
    href: string;
    img: string;
    start: string;
    end: string;
    loading?: boolean;
  };

  const {roomLabel, description, img, href, slots, onSelectSlot, loading} = $props<{
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

<a
        class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden"
        {href}
>
    <header>
        <img alt="banner" class="w-full" src={img}/>
    </header>
    <article class="space-y-4 p-4">
        <div>
            <h2 class="h3">{roomLabel}</h2>
        </div>
        <p class="opacity-60">
            {description}
        </p>
    </article>
    <footer class="flex items-center justify-between gap-4 p-4">
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
    </footer>
</a>

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