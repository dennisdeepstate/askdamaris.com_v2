<script>
    import { PUBLIC_HOST } from "$env/static/public"
    export let selected = false
    export let title = "title goes here"
    /**
     * @type {string}
     */
     export let thumb
     /**
     * @type {string}
     */
     export let link
     /**
     * @type {boolean}
     */
      export let isFree
      /**
     * @type {number}
     */
      export let episode
    function goToVideo(){
        window.location.href = `${PUBLIC_HOST}/videos/play/${link}`
    }
</script>
<style>
    .video_container{
        background-color: var(--color_white);
        background-size: cover;
        border-radius: var(--border_radius);
        cursor: pointer;
        display: inline-block;
        height: 270px;
        margin: 0 20px 0 0;
        position: relative;
        width: 480px;
        z-index: 6;
    }
    .video_title{
        background: var(--color_white_translucent);
        border-radius: 0 0 var(--border_radius) var(--border_radius);
        bottom: 0;
        box-sizing: border-box;
        height: 40px;
        margin: 0;
        padding: 10px 0 0 0;
        position: absolute;
        text-align: center;
        width: 100%;
    }
    .selected{
        box-shadow: var(--shadow_orange);
        transform: scale(1.15) translateY(-20px);
        transition: transform 200ms ease-out;
        z-index: 7;
    }
    .free::after{
        background: var(--color_purple_lite);
        border-radius: var(--border_radius) 0 var(--border_radius) 0;
        color: var(--color_white);
        content: "free episode";
        font-size: 16px;
        height: 20px;
        left: 0;
        padding: 4px;
        position: absolute;
        text-align: center;
        top: 0;
        width: 90px;
    }
    h5{
        display: inline-block;
    }
@media only screen and (max-width: 900px){
    .video_container{
        height: 180px;
        width: 320px;
    }
    .free::after{
        border-radius: 8px 0 8px 0;
        font-size: 12px;
        height: 15px;
        width: 65px;
    }
    a{
        font-size: 14px;
    }
}
</style>
<div class="video_container {selected ? "selected" : ""} {isFree ? "free": ""}" style="background-image: url({thumb});" on:click={()=>goToVideo()} on:keypress={()=>goToVideo()}>
    <div class="video_title">
        <h5>ep-{episode}: &nbsp;</h5><a title="{title}" href="{PUBLIC_HOST}/videos/play/{link}">{title.length > 41 ? title.slice(0,42) + "..." : title}</a>
    </div>
</div>