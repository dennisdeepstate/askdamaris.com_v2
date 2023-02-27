<script>
    import { PUBLIC_HOST } from "$env/static/public"
    import { showModal } from "$lib/js/showModal"
    import { FrontEndUser } from "$lib/js/userStore"

    /**
     * @type {{email: string | undefined; firstName: string | undefined; lastName: string | undefined;}}
     */
    let user
    FrontEndUser.subscribe((value) =>  { user = value })
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
     * @type {number}
     */
    export let rating
    /**
     * @type {string}
     */
    export let albumName
    /**
     * @type { {bunny_id: string; title: string; thumb: string; premium: boolean}[] }
     */
    export let relatedVideos
    /**
     * @type {any}
     */
    export let userRating 
    /**
     * @param {string} link
     */
    function goToVideo(link){
        if(!user.email || !user.firstName || !user.lastName) {
            showModal()
            return
        }
        window.location.href = link
    }
    /**
     * @param {number} rate
     */
    async function handleRadioClick(rate){
        if(!user.email || !user.firstName || !user.lastName) {
            showModal()
            return
        }
        const newRating = await fetch(`${PUBLIC_HOST}/user/rate`,
            {
                method: 'POST',
                body: JSON.stringify({
                    bunny_id: bunnyId,
                    rate: rate
                }),
                headers:{
                    'content-type': 'application/json'
                }
            }
        )
        rating = await newRating.json()
    }
    async function getUserRating(){
        const newUserRating = await fetch(`${PUBLIC_HOST}/user/rate/user_rating`,
            {
                method: 'POST',
                body: JSON.stringify(bunnyId),
                headers:{
                    'content-type': 'application/json'
                }
            }
        )
        userRating = JSON.stringify(await newUserRating.json())
    }
    $:if(user.email) getUserRating()
    
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
    .sibling_video_container{
        background-color: var(--color_blackish_translucent);
        cursor: pointer;
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 135px;
        margin: 8px 0;
        overflow: hidden;
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
        line-height: 120px;
        padding: 0;
        position: absolute;
        text-align: center;
        width: 240px;
    }
    .sibling_video_container > .description.free::before{
        background: var(--color_purple_lite);
        color: var(--color_white);
        content: "free";
        height: 20px;
        left: 0;
        padding: 4px;
        position: absolute;
        text-align: center;
        bottom: 0;
        width: 100%;
    }
    .sibling_video_container > .description {
        padding: 12px;
    }
    h3{
        margin: 10px 0 20px 0;
    }
    a:hover{
        text-decoration: underline;
    }
    .rate_container{
        height: 24px;
    }
    .rate{
        display: flex;
        flex-direction: row-reverse;
        float: left;
    }
    .rate > input{
        display: none;
    }
    .rate > label{
        color: var(--color_purple_lite);
        cursor: pointer;
        font-size: 24px;   
    }
    .rate.allow_rate > input:not(:checked) ~ label:hover ~ label, .rate.allow_rate > label:hover{
        color: var(--color_purple_main);
    }
    .rate.allow_rate > input:checked ~ label{
        color: var(--color_purple_main);
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
        line-height: 100px;
        width: 192px;
    }
    .sibling_video_container > .description.free::before{
        font-size: 12px;
        height: 12px;
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
@media only screen and (max-width: 480px){
    .play{
        width: 100%;
    }
}
</style>
<section>
    <div class="play">
        <div class="player">
            <iframe title="{bunnyId}" src="https://iframe.mediadelivery.net/embed/87688/{bunnyId}?autoplay=true&token={playToken}&expires={expiryTimeStamp}" loading="lazy" style="border: none; position: absolute; top: 0; height: 100%; width: 100%;" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;">
            </iframe>
        </div>
        <h3>{ title } | {albumName}</h3>
        <div class="rate_container">
            <div class="rate {user.email ? "allow_rate" : ""}">
                <input type="radio" name="rate" id="rate-5" value="5" bind:group={userRating} on:click={()=>handleRadioClick(5)}/>
                <label for="rate-5" class="icofont-heart"></label>
                <input type="radio" name="rate" id="rate-4" value="4" bind:group={userRating} on:click={()=>handleRadioClick(4)}/>
                <label for="rate-4" class="icofont-heart"></label>
                <input type="radio" name="rate" id="rate-3" value="3" bind:group={userRating} on:click={()=>handleRadioClick(3)}/>
                <label for="rate-3" class="icofont-heart"></label>
                <input type="radio" name="rate" id="rate-2" value="2" bind:group={userRating} on:click={()=>handleRadioClick(2)}/>
                <label for="rate-2" class="icofont-heart"></label>
                <input type="radio" name="rate" id="rate-1" value="1" bind:group={userRating} on:click={()=>handleRadioClick(1)}/>
                <label for="rate-1" class="icofont-heart"></label>
            </div>
        </div>
        <h5>{rating} / 5</h5>
        <div class="sibling_videos">
            {#each relatedVideos as relatedVideo, i}
                <div class="sibling_video_container" on:click={()=>goToVideo(`${PUBLIC_HOST}/videos/play/${relatedVideo.bunny_id}`)} on:keydown={()=>goToVideo(`${PUBLIC_HOST}/videos/play/${relatedVideo.bunny_id}`)}>
                    <div class="thumb {bunnyId === relatedVideo.bunny_id ? "playing" : ""}" style="background-image: url({relatedVideo.thumb});"></div>
                    <div class="description {relatedVideo.premium ? "" : "free"}">
                        <h5>episode {i + 1}</h5>
                        <a href="{PUBLIC_HOST}/videos/play/{relatedVideo.bunny_id}" on:click|preventDefault={()=>goToVideo(`${PUBLIC_HOST}/videos/play/${relatedVideo.bunny_id}`)}>{relatedVideo.title}</a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
