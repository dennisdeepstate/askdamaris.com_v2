<script>
    import Button from "$lib/Button.svelte"
    import VideoRoll from "$lib/VideoRoll.svelte"
    import { FrontEndUser } from "$lib/js/userStore"
    import { PUBLIC_HOST } from "$env/static/public"
    /**
     * @type {{ videos: []; name: string; price: number; }}
     */
    export let album
    /**
     * @type {{email: string | undefined; firstName: string | undefined; lastName: string | undefined;}}
     */
    let user
    FrontEndUser.subscribe((value) =>  { user = value })
    function handleCTA(){
        /**
         * @type {{premium: boolean; bunny_id: string;} []}
         */
        let freeVideos = []
        freeVideos = album.videos.filter(/**@param {{premium: boolean;}} video*/ video => !video.premium)
        window.location.href = freeVideos.length > 0 ? `${PUBLIC_HOST}/videos/play/${freeVideos[0].bunny_id}` : `${PUBLIC_HOST}/videos/`
    }
</script>
<style>
    #hero{
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        height: 70vh;
        margin: 0 auto;
        max-height: 624px;
        min-height: 540px;
        padding: 180px 15% 0 15%;
        overflow: hidden;
    }
    .hero_paragraph, .hero_title{
        margin: 0;
        padding: 4px;
        position: relative;
    }
    .bubble{
        background: linear-gradient(90deg, var(--color_purple_secondary) 0%, var(--color_orange_lite) 100%);
        height: 240px;
        position: absolute;
        width: 240px;
        z-index: -1;
    }
    .bubble.a{
        border-radius: 50% 50% 0 50%;
        right: 0;
    }
    .bubble.d{
        border-radius: 0 50% 50% 0;
        left: 0;
    }
    .roll{
        margin: 0;
        text-align: center;
        width: 100%;
    }
@media only screen and (max-width: 900px){
    #hero{
        align-items: start;
        gap: 0px;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 3fr;
        padding: 120px 5% 0 5%;
    }
    .hero_paragraph > p{
        font-size: 14px;
    }
    .bubble{
        height: 120px;
        width: 120px;
    }
}
@media only screen and (max-width: 600px){
    #hero{
        max-height: 720px;
        min-height: 624px;
    }
}
</style>
<section id="hero">
    <div class="hero_title">
        <div class="bubble a"></div>
        <h1>reach your full potential</h1>
    </div>
    <div class="hero_paragraph">
        <div class="bubble d"></div>
        <p>Welcome to ask damaris, a platform designed to empower individuals to reach their full potential and assist businesses in acheiving their goals. Our services include personalized consultations, training and workshops for teams. our expertly crafted educational sessions are based on proven techniques and we offer a wide range of options to meet your personal and professional development needs.</p>
        <Button style="cta" title="learn and grow" on:modal={handleCTA}/>
    </div>
</section>
<div class="roll">
    <VideoRoll videos={album.videos} albumName={ album.name } albumPrice={ album.price }/>
</div>