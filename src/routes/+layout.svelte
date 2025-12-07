<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from "$lib/components/Header.svelte";
  import {ShoppingCart} from "@lucide/svelte";
  import HeaderMobile from "$lib/components/HeaderMobile.svelte";

  let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

<div class="w-full h-full fixed grid grid-cols-[auto_1fr] overflow">
    <div class="absolute top-8 right-8 z-20">
        <a class='relative z-10 btn bg-blue-400 hover:bg-blue-900 aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5 shadow-lg shadow-blue-500/50 '
           href='/panier'>
            <span class="badge-icon bg-inherit shadow-xl absolute -right-2 -top-2 z-10 font-bold">0</span>
            <ShoppingCart class="size-5"/>
            <span class="text-xs font-bold">Mon panier</span>
        </a>
    </div>

    <div class="hidden lg:block">
        <Header/>
    </div>

    <div class="fixed w-full flex justify-center bottom-0 left-0 lg:hidden z-20">
        <HeaderMobile/>
    </div>

    {@render children()}
</div>