<script>
    import Map from '$lib/components/Map.svelte';
    import CatchyStickers from '$lib/components/CatchyStickers.svelte';

    const stickers = [
        "📍 Situés au cœur des 7 vallées",
        "À 25 min de Berck",
        "À 30 min du Touquet",
        "À 5 min de Campagne-lès-Hesdin",
        "À 15 min de Montreuil-sur-Mer",
    ];
</script>

<section class="w-full bg-black p-8 my-16">
    <div class="flex flex-col items-center justify-center gap-4 mb-8">
        <h2 class="h2 text-white text-center mb-4 font-extrabold">
            Infos pratiques
        </h2>
    </div>

    <div class="flex gap-8">
        <div>

            <CatchyStickers items={stickers}/>

            <div class="px-6 py-3 rounded-xl text-lg font-semibold shadow-md shadow-blue-500 w-fit whitespace-nowrap
        text-blue-500 border border-blue-500">
                <h3 class="text-xl font-semibold mb-3">🕒 Horaires d’ouverture</h3>
                <p>Du <strong>mercredi</strong> au <strong>dimanche</strong><br>
                    <strong>9h – 12h30</strong> et <strong>14h – 00h</strong></p>
            </div>
        </div>

        <div class="rounded-xl overflow-hidden shadow-xl border border-surface-200">
            <Map address="138 Grande Rue, Beaurainville" zoom={12}/>
        </div>

    </div>
</section>
