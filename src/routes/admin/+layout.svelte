<script lang="ts">
  import '../layout.css';
  import favicon from '$lib/assets/favicon.svg';

  let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

<div class="w-full h-full flex items-center justify-center p-4">
    {@render children()}
</div>