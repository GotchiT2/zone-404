<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import {TypeWriter} from 'svelte-typewrite';
  import {MapPin} from "@lucide/svelte";

  const texts = ['Ici, on se déconnecte pour de vrai', 'Ici, on ne se perd pas, on se retrouve'];
</script>

<section class="relative w-full bg-black">
    <video autoplay class="w-full h-full mask-b-from-60% mask-b-to-100%" loop playsinline src="/plop.webm"></video>
    <div class="absolute top-0 w-full h-full bg-[#00000080] flex items-center justify-center flex-col gap-4 p-4 text-center">
        <h1 class="h2 text-white">
            <Logo classname="w-64 md:w-128 mx-auto"/>
            <span class="sr-only">Zone 404</span>
            <span class="badge h5 bg-blue-400"><MapPin/>Beaurainville</span>
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
    </div>
</section>

<style>
    .arrow {
        width: 60px;
        height: 82px;
    }

    .arrow path {
        stroke: #fff;
        stroke-width: 2px;
        fill: transparent;
        animation: down 2s infinite;
    }

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