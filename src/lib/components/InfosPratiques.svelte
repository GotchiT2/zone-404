<script>
    import Map from '$lib/components/Map.svelte';
    import {ChevronDownIcon} from '@lucide/svelte';
    import {Accordion} from '@skeletonlabs/skeleton-svelte';
    import {slide} from 'svelte/transition';

    const stickers = [
        "📍 Situés au cœur des 7 vallées",
        "À 25 min de Berck",
        "À 30 min du Touquet",
        "À 5 min de Campagne-lès-Hesdin",
        "À 15 min de Montreuil-sur-Mer",
    ];

    const items = [
        {
            id: '1',
            title: 'Your skeleton is made of more than 200 bones',
            description:
                'Inside your body are 206 bones. Each bone plays a very important role in making all the mechanics of your body function properly. If a bone is broken, all the bones around it can’t perform their duty properly.',
        },
        {
            id: '2',
            title: 'The smallest bone in the body is in your ear',
            description:
                'The stapes, a bone in your inner ear, is the smallest of all your bones. This bone is also sometimes called the stirrup because of its Y shape. Together with the anvil and hammer bones, the stapes helps translate sounds you hear into waves your brain can understand.',
        },
        {
            id: '3',
            title: 'One bone isn’t connected to any other bones',
            description:
                'The hyoid bone, which is in your throat, is the only bone that doesn’t connect to a joint. The hyoid is responsible for holding your tongue in place.',
        },
    ];
</script>

<section class="w-full bg-black p-8 my-16" id="infos-pratiques">
    <div class="flex flex-col items-center justify-center gap-4 mb-8">
        <h2 class="h2 bg-blue-400 px-4 py-2 text-white mb-8 shadow-md shadow-blue-500/50 text-center font-extrabold">
            Infos pratiques
        </h2>
    </div>

    <div class="flex items-center justify-center gap-8">
        <!--        <div class="flex flex-col gap-6">-->
        <!--            <CatchyStickers items={stickers}/>-->
        <!--        </div>-->

        <div class="overflow-hidden shadow-xl border border-surface-200">
            <Map address="138 Grande Rue, Beaurainville" zoom={12}/>
        </div>

        <Accordion>
            {#each items as item, i (item)}
                {#if i !== 0}
                    <hr class="hr"/>
                {/if}
                <Accordion.Item value={item.id}>
                    <h3>
                        <Accordion.ItemTrigger class="font-bold flex items-center justify-between gap-2">
                            {item.title}
                            <Accordion.ItemIndicator class="group">
                                <ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180"/>
                            </Accordion.ItemIndicator>
                        </Accordion.ItemTrigger>
                    </h3>
                    <Accordion.ItemContent>
                        {#snippet element(attributes)}
                            {#if !attributes.hidden}
                                <div {...attributes} transition:slide={{ duration: 150 }}>
                                    {item.description}
                                </div>
                            {/if}
                        {/snippet}
                    </Accordion.ItemContent>
                </Accordion.Item>
            {/each}
        </Accordion>
        <!--        <div class="px-6 py-3 text-lg font-semibold shadow-md shadow-blue-500 w-fit whitespace-nowrap-->
        <!--         border bg-white">-->
        <!--            <h3 class="text-xl font-semibold mb-3 text-black">🕒 Horaires d’ouverture</h3>-->
        <!--            <p class="text-blue-500">Du <strong>mercredi</strong> au <strong>dimanche</strong><br>-->
        <!--                <strong>9h – 12h30</strong> et <strong>14h – 00h</strong></p>-->
        <!--        </div>-->

    </div>
</section>
