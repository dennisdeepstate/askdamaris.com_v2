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
        margin: 80px auto 0 auto;
    }
</style>
<section id="videos">
    {#each albums as album}
        <VideoRoll setAtCenter={true} videos={album.videos} albumName={ album.name } albumPrice={ album.price }/>
        <Spacer />
    {/each}
</section>
