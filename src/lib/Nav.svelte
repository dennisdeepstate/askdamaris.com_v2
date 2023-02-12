<script>
    import { showModal } from "$lib/js/showModal"
    import { page } from "$app/stores"
    import { PUBLIC_HOST } from "$env/static/public";
    import { afterUpdate } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    /**
     * @type {{authenticated: boolean; firstName: string | null; lastName: string | null;}}
     */
    let user = $page.data.user
     /**
     * @type {number}
     */
    let windowWidth
    /**
     * @type {boolean}
     */
    let showSideNav
    $: sideNavX = tweened(-240, {
        duration: 300,
        easing: cubicInOut
    })
    afterUpdate(()=>{
        if(windowWidth > 600) sideNavX.set(0, {duration: 0})
    })
    function handleResize(){
        if(windowWidth <= 600) sideNavX.set(-240, {duration: 0})
    }
    function handleProfileClick(){
        if(windowWidth > 600){
            showModal()
            return
        }
        showSideNav = !showSideNav
        sideNavX.set(showSideNav ? 0 : -240)
    }
</script>
<style>
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
        height: 30px;
        line-height: 30px;
        padding: 0;
        text-align: center;
        width: 30px;
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
        background-color: var(--color_offwhite);
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
        margin: 12px auto;
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
        padding: 4px 12px;
        position: absolute;
        left: 0;
        text-align: left;
        top: 0;
        width: 100%;
    }
}
</style>
<svelte:window bind:innerWidth={windowWidth} on:resize={handleResize} />
<nav>
    <div class="nav_container">
        <a href="/"><img src="{PUBLIC_HOST}/ad_logo.png" alt="logo" class="logo" title="learn and grow"/></a>
        <div class="menu">
            <ul style="transform: translateX({$sideNavX}px);">
                <li><a href="/#hero" class={$page.url.pathname === "/" && ( $page.url.hash === "" || $page.url.hash === "#hero" ) ? "active" : ""}>home</a></li>
                <li><a href="/#about" class={$page.url.hash === "#about" ? "active" : ""}>about</a></li>
                <li><a href="/#contact" class={$page.url.hash === "#contact" ? "active" : ""}>contact</a></li>
                <li><a href="/videos" class={$page.url.pathname === "/videos" ? "active" : ""}>videos</a></li>
                {#if showSideNav}
                    <li><a href=" " on:click|preventDefault={showModal}>profile</a></li>
                    <i on:click={handleProfileClick} on:keydown={handleProfileClick}>&#x2190;</i>
                {/if}
            </ul>
        </div>
        <div class="profile" on:click={handleProfileClick} on:keydown={handleProfileClick}>{user.firstName ? user.firstName.charAt(0).toUpperCase() : "?"}</div>
    </div>
</nav>