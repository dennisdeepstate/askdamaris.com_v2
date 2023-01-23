<script>
    import { showModal } from "$lib/js/showModal"
    import { page } from "$app/stores"
    /**
     * @type any}
     */
    export let user
</script>
<style>
    nav{
        align-items: center;
        background: var(--color_white_translucent);
        display: grid;
        height: 50px;
        justify-items: center;
        position: fixed;
        top: 0;
        width: 100vw;
        z-index: 12;
    }
    .nav_container{
        align-items: center;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        height: 100%;
        justify-items: center;
        max-width: 1280px;
        padding: 0 40px;
        width: 100%;
    }
    ul{
        position: relative;
    }
    ul > li{
        display: inline-block;
        margin: 0 0 0 20px;
    }
    .right > li{
        margin-left: 0;
        margin-right: 20px;
    }
    ul > li > a {
        color: var(--color_blackish);
        text-decoration: none;
    }
    ul > li > a:hover, .active{
        color: var(--color_purple_main);
        text-decoration: line-through;
    }
    h2{
        color: var(--blackish);
        font-weight: 400;
    }
    .profile{
        align-items: center;
        background-color: var(--color_purple_main);
        border-radius: 50%;
        box-sizing: border-box;
        color: var(--color_white);
        cursor: pointer;
        display: grid;
        height: 30px;
        margin: 0;
        padding: 0;
        position: absolute;
        right: -24px;
        text-align: center;
        top: -4px;
        width: 30px;
    }
@media only screen and (max-width: 600px){
    .menu{
        display: none;
    }
}
@media only screen and (max-width: 900px){
    .nav_container{
        grid-template-columns: 4fr 3fr 4fr;
    }
}
</style>

<nav>
    <div class="nav_container">
        <ul class="menu">
            <li><a href="/#hero" class={$page.url.pathname === "/" && ( $page.url.hash === "" || $page.url.hash === "#hero" ) ? "active" : ""}>home</a></li>
            <li><a href="/#about" class={$page.url.hash === "#about" ? "active" : ""}>about</a></li>
        </ul>
        <h2>ask damaris</h2>
        <ul class="menu right">
            <li><a href="/#contact" class={$page.url.hash === "#contact" ? "active" : ""}>contact</a></li>
            <li><a href="/videos" class={$page.url.pathname === "/videos" ? "active" : ""}>videos</a></li>
            <div class="profile" on:click={showModal} on:keydown={showModal}>{user ? user.firstName.charAt(0) : "G"}</div>
        </ul>
    </div>
</nav>