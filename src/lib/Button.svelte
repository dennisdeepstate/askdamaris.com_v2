<script>
    import { createEventDispatcher } from "svelte"

    export let style = 'cta'
    export let title = 'buy now'


	const dispatch = createEventDispatcher()

	function dispatchModal() {
		dispatch('modal')
	}
</script>
<style>
    .cta{
        background-color: var(--color_purple_main);
        color: var(--color_white);
    }
    .cta:hover{
        border: 1px solid var(--color_purple_main);
        background-color: var(--color_purple_secondary);
        color: var(--color_purple_main);
    }
</style>
<button class="{style}" on:click={dispatchModal}>{title}</button>
