<script lang="ts">
  import {onMount} from 'svelte';

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://www.billetweb.fr/js/export.js';
    script.async = true;
    document.body.appendChild(script);
  });
</script>

<section class="w-full h-full bg-white overflow-auto">

    <p class="text-center text-black italic mx-auto mt-4">Les réservations se font au plus tard deux heures avant le début du créneau.</p>

    <a class="shop_frame mt-4 shadow-2xl border" data-id="43776" data-initial-height="800"
       data-max-width="100%" data-resize="1" data-scrolling="no"
       data-src="https://www.billetweb.fr/multi_event.php?multi=43776"
       href="https://www.billetweb.fr/multi_event.php?multi=43776" target="_blank" title="Vente de billets en ligne">Vente
        de billets en ligne</a>
</section>