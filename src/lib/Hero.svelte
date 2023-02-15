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
        align-items: flex-end;
        box-sizing: border-box;
        display: grid;
        height: 100vh;
        justify-items: center;
        margin-top: 80px;
        max-height: 720px;
        min-height: 540px;
        text-align: center;
        width: 100%;
    }
    .hero_text{
        box-sizing: border-box;
        margin: 0 auto;
        position: relative;
        width: 75%;
    }
    .hero_text > p{
        font-size: 20px;
    }
    .roll{
        margin: 40px 0 0 0;
        width: 100%;
    }
@media only screen and (max-width: 1440px){
    .hero_text > p{
        font-size: 18px;
    }
}
@media only screen and (max-width: 900px){
    .hero_text > p{
        font-size: 16px;
    }
}
@media only screen and (max-width: 600px){
    .hero_text{
        width: 100%;
    }
}
</style>
<section id="hero">
    <div class="hero_text">
        <h2>reach your full potential</h2>
        <p>Welcome to ask damaris, a platform  designed to empower individuals to reach their full potential and assist businesses in acheiving their goals. Our services include personalized consultations, training and workshops for teams. our expertly crafted educational sessions are based on proven techniques and we offer a wide range of options to meet your personal and professional development needs.</p>
        <Button style="cta" title="learn and grow" on:modal={showModal}/>
    </div>
    <div class="roll">
        <VideoRoll videos={album.videos} albumName={ album.name } albumPrice={ album.price }/>
    </div>
</section>