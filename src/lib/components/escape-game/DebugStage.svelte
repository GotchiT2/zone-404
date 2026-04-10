<script>
	import { createEventDispatcher } from 'svelte';
	import TerminalStage from './TerminalStage.svelte';
	
	const dispatch = createEventDispatcher();
	
	export let token;
	
	function handleComplete() {
		dispatch('complete');
	}
</script>

<TerminalStage {token} on:complete={handleComplete} />