<script>
    import { PUBLIC_HOST } from "$env/static/public";
/**
 * @type { string }
 */
    export let bunnyId
    /**
 * @type {string}
 */
    export let playToken
    /**
 * @type {number}
 */
    export let expiryTimeStamp
    /**
 * @type {string}
 */
    export let title
    /**
 * @type {string}
 */
 export let albumName
    /**
 * @type { {bunny_id: string; title: string; thumb: string; premium: boolean}[] }
 */
    export let relatedVideos
</script>
<style>
    .play{
        width: 853px;
        margin: 40px auto;
    }
    .player{
        background-color: var(--color_blackish_translucent);
        height: 480px;
        position: relative;
        width: 100%; 
    }
    .sibling_videos{
        display: grid;
        gap: 8px;
        grid-template-columns: 1fr 1fr;
        padding: 12px 0;
        width: 100%;
    }
    .sibling_videos > a{
        text-decoration: none;
    }
    .sibling_video_container{
        background-color: var(--color_blackish_translucent);
        cursor: pointer;
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 135px;
        margin: 8px 0;
        padding: 0;
        position: relative;
    }
    .sibling_video_container:hover{
        transform: scale(1.05);
        transition: transform 100ms ease-in;
    }
    .sibling_video_container > .thumb {
        background-size: cover;
        height: 135px;
        width: 240px;
    }
    .sibling_video_container > .thumb.playing::after{
        content: "playing...";
        background-color: var(--color_purple_translucent);
        box-sizing: border-box;
        color: var(--color_white);
        height: 135px;
        padding: 4px;
        position: absolute;
        width: 240px;
    }
    .sibling_video_container > .description.free::before{
        background: var(--color_purple_main);
        color: var(--color_white);
        content: "free";
        height: 20px;
        left: 0;
        padding: 4px;
        position: absolute;
        text-align: center;
        bottom: 0;
        width: 30px;
    }
    .sibling_video_container > .description {
        padding: 12px;
    }
    h3{
        margin: 10px 0 20px 0;
    }
    h4:hover{
        text-decoration: line-through;
    }
@media only screen and (max-width: 900px){
    .play{
        width: 640px;
    }
    .player{
        height: 360px;
    }
    .sibling_videos{
        grid-template-columns: 1fr;
    }
    .sibling_video_container{
        grid-template-columns: 1fr 2fr;
        height: 108px;
    }
    .sibling_video_container > .thumb {
        height: 108px;
        width: 192px;
    }
    .sibling_video_container > .thumb.playing::after{
        height: 108px;
        width: 192px;
    }
    .sibling_video_container > .description.free::before{
        font-size: 12px;
        height: 12px;
        width: 20px;
    }
}
@media only screen and (max-width: 700px){
    .play{
        width: 480px;
    }
    .player{
        height: 270px;
    }
}
@media only screen and (max-width: 600px){
    .play{
        width: 384px;
    }
    .player{
        height: 216px;
    }
}
</style>
<section>
    <div class="play">
        <div class="player">
            <iframe title="{bunnyId}" src="https://iframe.mediadelivery.net/embed/87688/{bunnyId}?autoplay=true&token={playToken}&expires={expiryTimeStamp}" loading="lazy" style="border: none; position: absolute; top: 0; height: 100%; width: 100%;" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;">
            </iframe>
        </div>
        <h3>{ title } ({albumName})</h3>
        <div class="sibling_videos">
            {#each relatedVideos as relatedVideo, i}
            <a href="{PUBLIC_HOST}/videos/play/{relatedVideo.bunny_id}">
                <div class="sibling_video_container">
                    <div class="thumb {bunnyId === relatedVideo.bunny_id ? "playing" : ""}" style="background-image: url({relatedVideo.thumb});"></div>
                    <div class="description {relatedVideo.premium ? "" : "free"}">
                        <h5>episode {i + 1}</h5>
                        <h4>{relatedVideo.title}</h4>
                    </div>
                </div>
            </a>
            {/each}
        </div>
    </div>
</section>
