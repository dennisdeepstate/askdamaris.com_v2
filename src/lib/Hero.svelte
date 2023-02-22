<script>
    import Button from "$lib/Button.svelte"
    import VideoRoll from "$lib/VideoRoll.svelte"
    import { showModal } from "$lib/js/showModal"
    import { FrontEndUser } from "$lib/js/userStore";
    import { PUBLIC_HOST } from "$env/static/public";
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
        if(!user.email || !user.firstName || !user.lastName){
            showModal()
            return
        }
        window.location.href = freeVideos.length > 0 ? `${PUBLIC_HOST}/videos/play/${freeVideos[0].bunny_id}` : `${PUBLIC_HOST}/videos/`
    }
</script>
<style>
    /* .background_photo{
        position: absolute;
        z-index: -1;
    }
    .background_photo > img{
        border: 4px solid var(--color_white);
        border-radius: var(--border_radius);
        margin: 0 -10px -40px 0;
        height: 240px;
        object-fit: cover;
        overflow: hidden;
        width: 240px;
    } */
    #hero{
        align-items: flex-end;
        box-sizing: border-box;
        display: grid;
        height: 100vh;
        justify-items: center;
        margin-top: 80px;
        max-height: 720px;
        min-height: 540px;
        overflow: hidden;
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
        <!-- <div class="background_photo" style="left: -120px; top: -36px; transform: rotateZ(5deg)"><img src="workshop.jpg" alt="p" /></div>
        <div class="background_photo" style="right: -180px; top: 90px; transform: rotateZ(-6deg)"><img src="sessions.jpg" alt="p" /></div>
        <div class="background_photo" style="left: -180px; top: 120px; transform: rotateZ(-2deg)"><img src="sessions.jpg" alt="p" /></div> -->
        <h2>reach your full potential</h2>
        <p>Welcome to ask damaris, a platform  designed to empower individuals to reach their full potential and assist businesses in acheiving their goals. Our services include personalized consultations, training and workshops for teams. our expertly crafted educational sessions are based on proven techniques and we offer a wide range of options to meet your personal and professional development needs.</p>
        <Button style="cta" title="learn and grow" on:modal={handleCTA}/>
    </div>
    <div class="roll">
        <VideoRoll videos={album.videos} albumName={ album.name } albumPrice={ album.price }/>
    </div>
</section>