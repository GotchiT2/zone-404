<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from "$lib/components/Header.svelte";
  import HeaderMobile from "$lib/components/HeaderMobile.svelte";

  let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

<div class="w-full h-full fixed grid grid-cols-[auto_1fr] overflow">
    <div class="hidden lg:block">
        <Header/>
    </div>

    <div class="fixed w-full flex justify-center bottom-0 left-0 lg:hidden z-20">
        <HeaderMobile/>
    </div>

    {@render children()}
</div>