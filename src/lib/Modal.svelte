<script>
    import { PUBLIC_HOST } from "$env/static/public"
    import Button from "$lib/Button.svelte"
    import { Modal } from "$lib/js/modalStore"
    import { hideModal } from "$lib/js/showModal";

     export let user
    /**
     * @type {boolean}
     */
    let modal
    Modal.subscribe((value) =>  { modal = value })
    /**
     * @type {boolean}
     */
    let showLogin = user ? !user.authenticated : true
    /**
     * @type {boolean}
     */
    $:showRegister = ( user ? !user.authenticated : true) && !showLogin
    /**
     * @type {boolean}
     */
    let showBuy = false
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
     * @type {string | any[]}
     */
    let registerReplies = []
    /**
     * @type {boolean}
     */
    let registerSuccess

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

        if(registerSuccess) hideModal()
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
        margin: 120px calc( calc( 100vw - 400px ) / 2 );
        padding: 8px;
        position: fixed;
        height: 420px;
        overflow-y: scroll;
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
    .switch{
        color: var(--color_purple_main);
        cursor: pointer;
        font-style: italic;
        text-transform: lowercase;
    }
    .switch:hover{
        text-decoration: line-through;
    }
</style>
<div class="backdrop" style={ modal ? "" : "display: none;" } on:click={hideModal} on:keydown={hideModal}>
</div>
<div class="modal" style={ modal ? "" : "display: none;" }>
    <div class="login {showLogin ? "show" : ""}" style={ showLogin ? "" : "display: none;" }>
        <h3>Login</h3>
        <form name="login">
            <input name="email" type="email" placeholder="email"/>
            <input name="password" type="password" placeholder="password"/>
            <Button title="login" style="cta" />
        </form>
        <p class="switch" on:click={switchView} on:keydown={switchView}>Register Instead</p>
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
                {#each registerReplies as reply}
                    <p>{ reply }</p>
                {/each}
            </div>
            {/if}
            <Button title="register" style="cta" />
        </form>
        <p class="switch" on:click={switchView} on:keydown={switchView}>Login Instead</p>
    </div>
    <div class="checkout {showBuy ? "show" : ""}" style={ showBuy ? "" : "display: none;" }>
        buy this
        <form name="register">
            <input name="phone" type="phone" placeholder="phone"/>
            <Button title="Send" style="cta" />
        </form>
    </div>
</div>
