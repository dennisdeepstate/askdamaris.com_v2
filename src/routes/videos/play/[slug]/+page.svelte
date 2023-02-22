<script>
    import Play from "$lib/Play.svelte";
     /**
     * @type {{ title: string; album: string; bunnyId: string; userRating: string | null; rating: number; userCanRate: boolean; expiryTimeStamp: number; playToken: string; relatedVideos: any; }}
     */
    export let data
</script>
<svelte:head>
    <title>{data.title} - { data.album } | askdamaris</title>
</svelte:head>

<Play bunnyId={ data.bunnyId } title={ data.title } userRating={data.userRating} rating={data.rating} userCanRate={data.userCanRate} albumName={ data.album } expiryTimeStamp={ data.expiryTimeStamp } playToken = {data.playToken} relatedVideos={data.relatedVideos}/>