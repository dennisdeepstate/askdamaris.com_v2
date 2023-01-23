<script>
    import Button from "$lib/Button.svelte"
    import VideoRoll from "$lib/VideoRoll.svelte"
    import { showModal } from "$lib/js/showModal"
    /**
     * @type {{ videos: []; name: string; price: number; }}
     */
     export let album
</script>
<style>
    #hero{
        align-items: end;
        box-sizing: border-box;
        display: grid;
        height: 100vh;
        justify-items: center;
        min-height: 540px;
        text-align: center;
        width: 100vw;
    }
    .hero_text{
        box-sizing: border-box;
        font-size: 20px;
        margin: 0 auto;
        position: relative;
        width: 75%;
    }
    .roll{
        display: grid;
    }
@media only screen and (max-width: 900px){
    .hero_text{
        font-size: 18px;
    }
}
</style>
<section id="hero">
    <div class="hero_text">
        <h2>this is your opportunity for self actualisation</h2>
        <p>ask damaris is a platform that gives individuals an opportunity for self-actualisation and also supports businesses in their operations to achieve their desired outcomes. We offer one on one consultation sessions, training and workshops for teams and business process outsourcing.</p>
        <Button style="cta" title="reach for the stars" on:modal={showModal}/>
    </div>
    <div class="roll">
        <VideoRoll videos={album.videos} albumName={ album.name } albumPrice={ album.price }/>
    </div>
</section>