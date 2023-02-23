<script>
    import Play from "$lib/Play.svelte";
     /**
     * @type {{ title: string; album: string; bunnyId: string; userRating: string | undefined; rating: number;expiryTimeStamp: number; playToken: string; relatedVideos: any; }}
     */
    export let data
</script>
<svelte:head>
    <title>{data.title} - { data.album } | askdamaris</title>
</svelte:head>

<Play bunnyId={ data.bunnyId } title={ data.title } userRating={data.userRating} rating={data.rating} albumName={ data.album } expiryTimeStamp={ data.expiryTimeStamp } playToken = {data.playToken} relatedVideos={data.relatedVideos}/>