<script>
    export let loading = true
	import { tweened } from 'svelte/motion'
	import { expoOut } from 'svelte/easing'

	const bannerHeight = tweened(100, {
		duration: 2000,
		easing: expoOut
	})
    
    $: loading ? bannerHeight.set(100) : bannerHeight.set(0)
</script>
<style>
    .banner{
        background: var(--gradient);
        display: grid;
        min-height: 53px;
        height: 100vh;
        justify-items: center;
        position: fixed;
        top: 0;
        width: 100vw;
        z-index: 9;
    }
    h1{
        animation-name: breathing;
        animation-duration: 4s;
        animation-fill-mode: both;
        animation-iteration-count:  infinite;
        color: var(--color_white_translucent);
        margin: -10px 0 0 0;
        position: absolute;
        top: 0;
        text-align: center;
        z-index: 11;
    }
    h1.copy{
        animation-delay: 1.5s;
        color: rgba(0, 0, 0, 0);
        -webkit-text-stroke: 2px var(--color_blackish);
        z-index: 10;
    }
</style>
<div class="banner" style="height: { $bannerHeight }vh; {loading ? "z-index: 13;" : ""}">
    <h1 class="copy" style="transform: translate(20px, calc({ Math.min($bannerHeight * 0.7, 40) }vh))">ask damaris</h1>
    <h1 style="transform: translateY({ Math.min($bannerHeight * 0.7, 40) }vh)">ask damaris</h1>
</div>


