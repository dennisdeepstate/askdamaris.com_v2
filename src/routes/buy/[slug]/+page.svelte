<script>
    import Buy from "$lib/Buy.svelte";
     /**
     * @type {{ album: string; videos: { title: string; thumb: string; } []; price: number;}}
     */
    export let data
</script>
<svelte:head>
    <title>{ data.album } | askdamaris</title>
</svelte:head>
<Buy albumName={data.album} videos={data.videos} price={data.price}/>

