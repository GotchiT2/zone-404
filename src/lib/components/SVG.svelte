<script lang="ts">
  let {viewBox, children, ...others} = $props()
</script>
<svg
        {...others}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
>
    {@render children?.()}
</svg>
<style>
    svg {
        fill: white;
        transition: .2s ease;
    }

    svg:hover {
        fill: black;
    }
</style>