<script>
    import Play from "$lib/Play.svelte";
     /**
     * @type {{ title: string; album: string; bunnyId: string; rate: string | null; rating: number; ratingLocked: boolean; expiryTimeStamp: number; playToken: string; relatedVideos: any; }}
     */
    export let data
</script>
<svelte:head>
    <title>{data.title} - { data.album } | askdamaris</title>
</svelte:head>

<Play bunnyId={ data.bunnyId } title={ data.title } rate={data.rate} rating={data.rating} ratingLocked={data.ratingLocked} albumName={ data.album } expiryTimeStamp={ data.expiryTimeStamp } playToken = {data.playToken} relatedVideos={data.relatedVideos}/>