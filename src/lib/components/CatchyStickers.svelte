<script lang="ts">

  let {items = []} = $props();

  let container;

  // onMount(() => {
  //   const handleScroll = () => {
  //     const offset = window.scrollY * 0.15;
  //     const bands = container.querySelectorAll('.sticker-band');
  //
  //     bands.forEach((band, i) => {
  //       const direction = i % 2 === 0 ? 1 : -1;  // alternance gauche/droite
  //       band.style.transform = `translateX(${offset * direction}px) rotate(${i % 2 === 0 ? '-1.5deg' : '1.5deg'})`;
  //     });
  //   };
  //
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // });
</script>

<style>
    .sticker-band {
        transition: transform 0.1s linear;
    }
</style>

<div bind:this={container} class="space-y-4 py-6">
    {#each items as txt, i}
        <div
                class="px-6 py-3 bg-white rounded-xl text-lg font-semibold shadow-md shadow-blue-500 w-fit whitespace-nowrap
        text-blue-500 sticker-band"
        >
            {txt}
        </div>
    {/each}
</div>
