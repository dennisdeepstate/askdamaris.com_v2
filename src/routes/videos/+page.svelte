<script>
    import VideoAlbum from "$lib/VideoAlbum.svelte"
    /**
     * @type {import('./$types').PageData}
     */
    export let data

</script>
<svelte:head>
    <title>videos | askdamaris</title>
</svelte:head>
<VideoAlbum albums={ data.albums }/>