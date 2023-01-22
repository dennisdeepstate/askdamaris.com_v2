<script>
    import Play from "$lib/Play.svelte";
    /**
     * @type {import('./$types').PageData}
     */
     export let data
</script>
<svelte:head>
    <title>{data.title} ({ data.album }) | askdamaris</title>
</svelte:head>

<Play bunnyId={ data.bunnyId } title={ data.title } albumName={ data.album } expiryTimeStamp={ data.expiryTimeStamp } playToken = {data.playToken} relatedVideos={data.relatedVideos}/>