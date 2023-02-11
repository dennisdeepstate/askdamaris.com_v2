<script>
    import Video from "$lib/Video.svelte"
    import { afterUpdate, onMount } from "svelte"
    import { tweened } from 'svelte/motion'
	import { cubicInOut } from 'svelte/easing'
    import { PUBLIC_HOST } from "$env/static/public";
    
    /**
     * @type {boolean}
     */
     export let setAtCenter = true
     /**
     * @type {{ bunny_id: string; title: string; thumb: string; description: string; premium: boolean;}[]}
     */
    export let videos = []
    /**
     * @type {string}
     */
     export let albumName
    /**
     * @type {number}
     */
     export let albumPrice
     /**
     * @type {HTMLElement}
     */
     let roll
    /**
     * @type {number}
     */
    let rollOffset
    /**
     * @type {number}
     */
     let rollHeight
     /**
     * @type {number}
     */
     let scroll
    /**
     * @type {number}
     */
    let windowHeight
    /**
     * @type {number}
     */
    let videoWidth
    /**
     * @type {number}
     */
    let videoBoundingWidth
    /**
     * @type {number}
     */
    let viewWidth
    /**
     * @type {number}
     */
    let offsetRollerStart
    afterUpdate(() => {
        videoWidth = viewWidth > 900 ? 480 : 320
        videoBoundingWidth = videoWidth + 20
        offsetRollerStart =  setAtCenter ? (viewWidth / 2) - (videoWidth / 2) : (viewWidth > 900 ? 120 : 100)
	})
    onMount(() => {
        rollOffset = roll.offsetTop - (windowHeight * 0.4 )
        rollHeight = roll.clientHeight
    })
    $: offsetRoller = tweened(offsetRollerStart, {
        duration: 500,
        easing: cubicInOut
    })
    function rollLeft(){
        offsetRoller.set(Math.max($offsetRoller - videoBoundingWidth, (-1 * videoBoundingWidth * ( videos.length - 1)) + offsetRollerStart))
    }
    function rollRight(){
        offsetRoller.set(Math.min($offsetRoller + videoBoundingWidth, offsetRollerStart))
    }
    /**
     * @param {KeyboardEvent & { currentTarget: EventTarget & Window; }} event
     */
    function handleKeyDown(event){
        if( event.code === "ArrowRight" && scroll  > rollOffset && scroll < rollOffset + rollHeight ) rollLeft()
        if( event.code === "ArrowLeft" && scroll  > rollOffset && scroll < rollOffset + rollHeight ) rollRight()
    }
</script>
<style>
    h3{
        margin-bottom: 10px;
    }
    .price{
        margin: 0 0 10px 0;
    }
    #video_roll{
        height: 270px;
        padding: 0;
        width: 100%;
    }
    .roll_container{
        height: 270px;
        left: 0;
        margin-bottom: 40px;
        padding: 50px 0;
        position: absolute;
        overflow-x: hidden;
        overflow-y: hidden;
        width: 100%;
    }
    .roller{
        left: 0;
        position: absolute;
        white-space: nowrap;
    }
    .scroller{
        align-items: center;
        display: grid;
        cursor: pointer;
        justify-items: center;
        height: 100%;
        position: absolute;
        transform: translateY(-40px);
        width: 80px;
        z-index: 8;
    }
    .arrow{
        background-color: var(--color_white_translucent);
        border-radius: 50%;
        box-shadow: var(--shadow_orange);
        color: var(--color_orange_main);
        font-size: 18px;
        font-weight: bold;
        height: 24px;
        line-height: 24px;
        padding: 12px;
        width: 24px;
    }
    .arrow:hover{
        transform: scale(1.1);
    }
    .scroller.left{
        left: 0;
    }
    .scroller.right{
        right: 0;
    }
@media only screen and (max-width: 900px){
    #video_roll, .roll_container{
        height: 180px;
    }
    .arrow{
        font-size: 16px;
        height: 18px;
        line-height: 18px;
        padding: 9px;
        width: 18px;
    }
}
</style>
<svelte:window bind:innerWidth={viewWidth} on:keydown={(e) => handleKeyDown(e)} bind:scrollY={scroll} bind:innerHeight={windowHeight}/>
<h3>{ albumName }</h3>
<a href="{PUBLIC_HOST}/buy/{albumName}" class="price">available for KES {albumPrice}</a>
<div id="video_roll" bind:this={roll}>
    <div class="roll_container">
        <div class="scroller left" on:click={rollRight} on:keydown={rollRight}>
            <div class="arrow">&#x2190;</div>
        </div>
        <div class="roller" style="transform: translateX({ $offsetRoller }px);">
            {#each videos as video, i}
                <Video isFree={!video.premium} link={video.bunny_id} thumb={video.thumb} episode={i+1} selected={ ( $offsetRoller <= offsetRollerStart - (videoBoundingWidth * i) ) && ( $offsetRoller > (offsetRollerStart - ( videoBoundingWidth + (videoBoundingWidth * i) ))) } title={video.title}/>
            {/each}
        </div>
        <div class="scroller right" on:click={rollLeft} on:keydown={rollLeft}>
            <div class="arrow">&#x2192;</div>
        </div>
    </div>
</div>