<script>
    import { showModal } from "$lib/js/showModal"
    import { page } from "$app/stores"
    /**
     * @type {{authenticated: boolean; firstName: string | null; lastName: string | null;}}
     */
     let user = $page.data.user
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
    ul > li > a {
        color: var(--color_blackish);
        text-decoration: none;
    }
    ul > li > a:hover, .active{
        color: var(--color_purple_main);
        text-decoration: line-through;
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
@media only screen and (max-width: 600px){
    ul{
        background-color: var(--color_white);
        height: 100vh;
        position: absolute;
        right: 0;
        top: 0;
        /* transform: translateX(240px); */
        width: 240px;
    }
    ul > li{
        display: block;
    }
}
@media only screen and (max-width: 900px){
    ul > li{
        margin: 0 15px;
    }
}
</style>

<nav>
    <div class="nav_container">
        <img src="#" alt="logo"/>
        <div class="menu">
            <ul>
                <li><a href="/#hero" class={$page.url.pathname === "/" && ( $page.url.hash === "" || $page.url.hash === "#hero" ) ? "active" : ""}>home</a></li>
                <li><a href="/#about" class={$page.url.hash === "#about" ? "active" : ""}>about</a></li>
                <li><a href="/#contact" class={$page.url.hash === "#contact" ? "active" : ""}>contact</a></li>
                <li><a href="/videos" class={$page.url.pathname === "/videos" ? "active" : ""}>videos</a></li>
                
            </ul>
        </div>
        <div class="profile" on:click={showModal} on:keydown={showModal}>{user.firstName ? user.firstName.charAt(0).toUpperCase() : "G"}</div>
    </div>
</nav>