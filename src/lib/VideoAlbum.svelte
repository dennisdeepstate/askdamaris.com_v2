<script>
    import VideoRoll from "$lib/VideoRoll.svelte";
    import Spacer from "$lib/Spacer.svelte";
    /**
     * @type {{ videos: []; name: string; price: number; } []}
     */
      export let albums
</script>
<style>
    #videos{
        display: grid;
        text-align: center;
        margin-top: 80px;
    }
</style>
<section id="videos">
    {#each albums as album}
        <VideoRoll setAtCenter={false} videos={album.videos} albumName={ album.name } albumPrice={ album.price }/>
        <Spacer />
    {/each}
</section>
