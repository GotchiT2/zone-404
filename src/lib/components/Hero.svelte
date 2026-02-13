<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import {TypeWriter} from 'svelte-typewrite';

  const texts = ['Ici, on se déconnecte pour de vrai', 'Ici, on ne se perd pas, on se retrouve'];
</script>

<section class="relative w-full">
    <video autoplay class="w-full h-full mask-b-from-60% mask-b-to-100%" loop playsinline src="/plop.webm"></video>
    <div class="absolute top-0 w-full h-full bg-[#00000080] flex items-center justify-center flex-col gap-4 p-4 text-center">
        <h1 class="h2 text-white">
            <Logo classname="w-64 md:w-128 mx-auto"/>
            <span class="sr-only">Zone 404</span>
        </h1>

        <div class="h3 md:h2 text-white mt-4">
            <TypeWriter {texts}/>
        </div>

        <a class="mt-32" href="#salles">
            <svg class="arrow">
                <path class="a1" d="M0 0 L30 22 L60 0"></path>
                <path class="a2" d="M0 20 L30 42 L60 20"></path>
                <path class="a3" d="M0 40 L30 62 L60 40"></path>
            </svg>
            <span class="sr-only">Voir la suite</span>
        </a>

        <!--        <div class="flex gap-8">-->
        <!--            <a class="btn h5 bg-blue-400 hover:bg-blue-900 mt-16" href="/#salles">Découvrir nos salles</a>-->
        <!--            <a class="btn h5 preset-outlined-surface-500 mt-16" href="/#offres">Découvrir nos offres</a>-->
        <!--        </div>-->
    </div>
</section>

<style>
    .arrow {
        width: 60px;
        height: 82px;
    }

    /* set arrow styles */
    .arrow path {
        stroke: #fff;
        stroke-width: 2px;
        fill: transparent;
        animation: down 2s infinite;
    }

    /* arrow keyframe animation */
    @keyframes down {
        0% {
            opacity: 0
        }
        25% {
            opacity: 1
        }
        75% {
            opacity: 0
        }
        100% {
            opacity: 0
        }
    }

    /* arrow animation delay */
    .arrow path.a1 {
        animation-delay: -1s;
    }

    .arrow path.a2 {
        animation-delay: -.5s;
    }

    .arrow path.a3 {
        animation-delay: 0s;
    }
</style>