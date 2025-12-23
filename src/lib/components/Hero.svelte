<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import {TypeWriter} from 'svelte-typewrite';

  const texts = ['Ici, on se déconnecte pour de vrai', 'Ici, on ne se perd pas, on se retrouve'];
</script>

<section class="relative w-full">
    <video autoplay class="w-full h-full mask-b-from-60% mask-b-to-100%" loop playsinline src="/plop.webm"></video>
    <div class="absolute top-0 w-full h-full bg-[#00000080] flex items-center justify-center flex-col gap-4 p-4 text-center">
        <h1 class="h1 text-white">
            <Logo classname="w-128 mx-auto"/>
            <span class="sr-only">Zone 404</span>
        </h1>

        <div class="h2 text-white mt-4">
            <TypeWriter {texts}/>
        </div>

        <div class="flex gap-8">
            <a class="btn h5 bg-blue-400 hover:bg-blue-900 mt-16" href="/#salles">Découvrir nos salles</a>
            <a class="btn h5 preset-outlined-surface-500 mt-16" href="/#offres">Découvrir nos offres</a>
        </div>
    </div>
</section>