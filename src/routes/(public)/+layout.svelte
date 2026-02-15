<script lang="ts">
  import '../layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from "$lib/components/Header.svelte";
  import HeaderMobile from "$lib/components/HeaderMobile.svelte";

  import {PUBLIC_BANDEAU_MESSAGE} from '$env/static/public';
  import Footer from "$lib/components/Footer.svelte";

  let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

{#if PUBLIC_BANDEAU_MESSAGE}
    <div class="w-full bg-blue-400 flex flex-col items-center items-center gap-2 p-4 lg:grid-cols-[1fr_auto] border-b border-b-white">
        <p class="text-sm font-bold opacity-80">{PUBLIC_BANDEAU_MESSAGE}</p>
    </div>
{/if}

<div class="w-full h-full fixed grid grid-cols-[auto_1fr] overflow scroll-smooth">

    <div class="hidden lg:block">
        <Header/>
    </div>

    <div class="fixed w-full flex justify-center bottom-0 left-0 lg:hidden z-20">
        <HeaderMobile/>
    </div>

    <div class="w-auto h-full overflow-scroll flex flex-col items-center">
        {@render children()}

        <Footer/>
    </div>

</div>