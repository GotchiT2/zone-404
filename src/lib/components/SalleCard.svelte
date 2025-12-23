<svelte:options customElement="salle-card"/>

<script lang="ts">
  type Slot = {
    id: string;
    description: string;
    href: string;
    img: string;
  };

  const {roomLabel, description, img, href} = $props<{
    roomLabel: string;
    slots: Slot[];
    onSelectSlot: (slot: Slot) => void
  }>();
</script>

<div
        class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden"
>
    <a {href}>
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
            <slot></slot>
        </article>
    </a>
</div>
