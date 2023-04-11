<script>
    import { showModal } from "$lib/js/showModal"
    import { page } from "$app/stores"
    import { PUBLIC_HOST } from "$env/static/public";
    import { afterUpdate } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { FrontEndUser } from "$lib/js/userStore";
    /**
     * @type {{email: string | undefined; firstName: string | undefined; lastName: string | undefined;}}
     */
    let user
    FrontEndUser.subscribe((value) =>  { user = value })
     /**
     * @type {number}
     */
    let windowWidth
    /**
     * @type {boolean}
     */
    let showSideNav
    $: sideNavX = tweened(-300, {
        duration: 300,
        easing: cubicInOut
    })
    afterUpdate(()=>{
        if(windowWidth > 600) sideNavX.set(0, {duration: 0})
    })
    function handleResize(){
        if(windowWidth <= 600) sideNavX.set(-300, {duration: 0})
    }
    function toggleNav(){
        if(windowWidth <= 600){
            showSideNav = !showSideNav
            sideNavX.set(showSideNav ? 0 : -300)
            return
        }
    }
    function handleProfileClick(){
        if(windowWidth > 600){
            showModal()
            return
        }
        toggleNav()
    }

let countDownDate = new Date("April 10, 2023 24:00:00").getTime()
/**
* @type {number}
*/
let days 
/**
 * @type {number}
 */
let hours
/**
 * @type {number}
 */
let minutes
/**
 * @type {number}
 */
let seconds

// Update the countdown every second
let x = setInterval(function() {
  let now = new Date().getTime()
  let distance = countDownDate - now

  days = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds = Math.floor((distance % (1000 * 60)) / 1000)

  if (distance < 0) {
    clearInterval(x)
    days = 0
    hours = 0
    minutes = 0
    seconds = 0
  }
}, 1000)

</script>
<style>
    /* .holiday_offer{
        background-color: var(--color_purple_main);
        color: var(--color_white);
        display: block;
        height: 40px;
        padding: 4px;
        position: fixed;
        text-align: center;
        top: 0;
        width: 100%;
        z-index: 12;
    }
    .holiday_offer > a{
        color: var(--color_white);
        cursor: pointer;
        margin: 0;
    } */
    nav{
        align-items: center;
        background: var(--color_white_translucent);
        box-sizing: border-box;
        display: grid;
        height: 50px;
        justify-items: center;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 12;
    }
    .nav_container{
        align-items: center;
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        height: 100%;
        justify-items: center;
        max-width: 1280px;
        padding: 0 40px;
        width: 100%;
    }
    ul{
        margin: 0;
        padding: 0;
        position: relative;
    }
    ul > li{
        display: inline-block;
        margin: 0 30px;
    }
    .active{
        color: var(--color_purple_main);
        text-decoration: line-through;
    }
    .logo{
        cursor: pointer;
        height: 28px;
        margin: 1px 0;
        object-fit: contain;
    }
    .profile{
        background-color: var(--color_purple_main);
        border-radius: 50%;
        box-sizing: border-box;
        color: var(--color_white);
        cursor: pointer;
        height: 35px;
        line-height: 35px;
        min-width: 35px;
        padding: 0 8px;
        text-align: center;
    }
    .profile.login_button{
        background-color: var(--color_purple_secondary);
        border: 1px solid var(--color_purple_main);
        border-radius: var(--border_radius_secondary);
        color: var(--color_purple_main);
        max-width: 132px;
    }
    .profile.login_button:hover{
        border: 1px solid var(--color_purple_main);
        text-decoration: line-through;
    }
@media only screen and (max-width: 900px){
    ul > li{
        margin: 0 15px;
    }
}
@media only screen and (max-width: 600px){
    .nav_container{
        grid-template-columns: 1fr 1fr 1fr; 
    }
    ul{
        background-color: var(--color_white);
        box-sizing: border-box;
        height: 100vh;
        padding: 40px;
        position: fixed;
        text-align: center;
        left: 0;
        top: 0;
        width: 240px;
    }
    ul > li{
        display: block;
        margin: 24px auto 12px auto;
    }
    a.active{
        text-decoration: underline;
    }
    a:hover{
        text-decoration: underline;
    }
    i{
        box-sizing: border-box;
        border-bottom: 1px solid var(--color_greyish);
        cursor: pointer;
        font-style: normal;
        font-size: 24px;
        padding: 11px 11px;
        position: absolute;
        left: 0;
        text-align: left;
        top: 0;
        width: 100%;
    }
}
</style>
<svelte:window bind:innerWidth={windowWidth} on:resize={handleResize}/>
<!-- <div class="holiday_offer">
    <a href="{PUBLIC_HOST}/buy/Unlocking%20your%20potential">get unlocking your potential for only KES1500 this easter!</a>
    <div class="counter">
        {days ?? 0} days : {hours ?? 0} hours : {minutes ?? 0} minutes : {seconds ?? 0} seconds remaining
    </div>
</div> -->
<nav>
    <div class="nav_container">
        <a href="/"><img src="{PUBLIC_HOST}/ad_logo.png" alt="logo" class="logo" title="learn and grow"/></a>
        <div class="menu">
            <ul style="transform: translateX({$sideNavX}px);">
                <li><a href="/#hero" class={$page.url.pathname === "/" && ( $page.url.hash === "" || $page.url.hash === "#hero" ) ? "active" : ""} on:click={toggleNav}>Home</a></li>
                <li><a href="/#about" class={$page.url.hash === "#about" ? "active" : ""} on:click={toggleNav}>About</a></li>
                <li><a href="/#contact" class={$page.url.hash === "#contact" ? "active" : ""} on:click={toggleNav}>Contact</a></li>
                <li><a href="/videos" class={$page.url.pathname === "/videos" ? "active" : ""} on:click={toggleNav}>Videos</a></li>
                {#if showSideNav}
                    <li><a href=" " on:click|preventDefault={showModal}>{!user.firstName ? "Login / Register" : "Profile" }</a></li>
                    <i on:click={toggleNav} on:keydown={toggleNav}>&#x2190;</i>
                {/if}
            </ul>
        </div>
        <div class="profile {windowWidth <= 600 || !user.firstName ? "login_button" : ""}" on:click={handleProfileClick} on:keydown={handleProfileClick}>{windowWidth <= 600 ?  "Menu" : (user.firstName ? user.firstName.charAt(0).toUpperCase() :"Login / Register")}</div>
    </div>
</nav>