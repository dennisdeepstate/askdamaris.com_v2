<script>
    import { PUBLIC_HOST } from "$env/static/public"
    import Button from "$lib/Button.svelte"
    import { Modal } from "$lib/js/modalStore"
    import { hideModal } from "$lib/js/showModal";
    import { page } from "$app/stores"
    /**
     * @type {{authenticated: boolean; firstName: string | null; lastName: string | null;}}
     */
    let user = $page.data.user
    /**
     * @type {boolean}
     */
    let modal
    Modal.subscribe((value) =>  { modal = value })
    /**
     * @type {boolean}
     */
    $:showLogin = !user.authenticated
    /**
     * @type {boolean}
     */
    $:showRegister = !user.authenticated && !showLogin
    /**
     * @type {boolean}
     */
    let showProfile = user.authenticated
    /**
     * @type {string}
     */
    let registerEmail
    /**
     * @type {string}
     */
    let registerPassword
    /**
     * @type {string}
     */
    let firstName
    /**
     * @type {string}
     */
    let lastName
    /**
     * @type {string[]}
     */
    let registerReplies = []
    /**
     * @type {boolean}
     */
    let registerSuccess
    /**
     * @type {string}
     */
     let loginEmail
    /**
     * @type {string}
     */
    let loginPassword
    /**
     * @type {string[]}
     */
    let loginReplies = []
    /**
     * @type {boolean}
     */
    let loginSuccess

   async function createUser(){
        let form = {
            email: registerEmail,
            firstName: firstName,
            lastName: lastName,
            password: registerPassword
        }
        const reply = await fetch(`${PUBLIC_HOST}/user/register`,{ 
            method: 'POST',
            body: JSON.stringify(form),
            headers:{
                'content-type': 'application/json'
            }
        })
        const message = await reply.json()
        registerSuccess = message.success
        registerReplies = message.replies

        if(registerSuccess) {
            hideModal()
            window.location.href = `${PUBLIC_HOST}/videos`
        }
   }
   async function login(){
        let form = {
            email: loginEmail,
            password: loginPassword
        }
        const reply = await fetch(`${PUBLIC_HOST}/user/login`,{ 
            method: 'POST',
            body: JSON.stringify(form),
            headers:{
                'content-type': 'application/json'
            }
        })
        const message = await reply.json()
        loginSuccess = message.success
        loginReplies = message.replies

        if(loginSuccess) {
            hideModal()
            window.location.href = `${PUBLIC_HOST}/videos`
        }
   }
   function switchView(){
    showLogin = !showLogin
   }
</script>
<style>
    .backdrop{
        background-color: var(--color_purple_translucent);
        height: 100vh;
        margin: 0;
        padding: 0;
        position: fixed;
        top: 0;
        width: 100vw;
        z-index: 13;
    }
    .modal{
        background-color: var(--color_white);
        border-radius: var(--border_radius);
        margin: 12vh calc( calc( 100vw - 400px ) / 2 ) 0 calc( calc( 100vw - 400px ) / 2 );
        max-height: 70vh;
        padding: 12px;
        position: fixed;
        overflow-y: auto;
        top: 0;
        text-align: center;
        width: 400px;
        z-index: 14;
    }
    .show{
        animation-name: appear_x;
        animation-duration: 800ms;
        animation-fill-mode: both;
        animation-timing-function: ease-out;
        display: grid;
    }
    input{
        border: 1px solid var(--color_purple_translucent);
        border-radius: var(--border_radius_secondary);
        display: block;
        margin: 8px auto;
        padding: 0 25px;
        height: 50px;
        width: 80%;
    }
    h3{
        margin: 8px;
    }
    a{
        font-style: italic;
        margin: 12px 0;
        text-transform: lowercase;
    }
    .reply{
        border-radius: var(--border_radius);
        box-sizing: border-box;
        margin: 12px auto;
        padding: 8px;
        text-align: left;
        width: 90%;
    }
    .reply.success{
        background-color: var(--color_success_secondary);
        border: 1px solid var(--color_success_main);
        color: var(--color_success_main);
    }
    .reply.error{
        background-color: var(--color_error_secondary);
        border: 1px solid var(--color_error_main);
        color: var(--color_error_main);
    }
</style>
<div class="backdrop" style={ modal ? "" : "display: none;" } on:click={hideModal} on:keydown={hideModal}>
</div>
<div class="modal" style={ modal ? "" : "display: none;" }>
    <div class="login {showLogin ? "show" : ""}" style={ showLogin ? "" : "display: none;" }>
        <h3>Login</h3>
        <form name="login" on:submit|preventDefault={login}>
            <input name="email" type="email" placeholder="email" bind:value={loginEmail}/>
            <input name="password" type="password" placeholder="password" bind:value={loginPassword}/>
            {#if loginReplies.length > 0}
            <div class="reply { loginSuccess ? "success" : "error"}">
                <ul>
                    {#each loginReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
            {/if}
            <Button title="login" style="cta" />
        </form>
        <a on:click|preventDefault={switchView} href="/">Register Instead</a>
    </div>
    <div class="register {showRegister ? "show" : ""}" style={ showRegister ? "" : "display: none;" }>
        <h3>Register</h3>
        <form name="register" on:submit|preventDefault={createUser}>
            <input name="email" type="email" placeholder="email" bind:value={registerEmail} required/>
            <input name="first_name" type="text" placeholder="first name" bind:value={firstName} required/>
            <input name="last_name" type="text" placeholder="last name" bind:value={lastName} required/>
            <input name="password" type="text" placeholder="password" bind:value={registerPassword} required/>
            {#if registerReplies.length > 0}
            <div class="reply { registerSuccess ? "success" : "error"}">
                <ul>
                    {#each registerReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
            {/if}
            <Button title="register" style="cta" />
        </form>
        <a on:click|preventDefault={switchView} href="/">Login Instead</a>
    </div>
    <div class="profile {showProfile ? "show" : ""}" style={ showProfile ? "" : "display: none;" }>
        <h3>{ user.firstName } { user.lastName }</h3>
        <a href="{PUBLIC_HOST}/user/logout">logout</a>
    </div>
</div>
