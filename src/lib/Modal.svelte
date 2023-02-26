<script>
    import { PUBLIC_HOST } from "$env/static/public"
    import Button from "$lib/Button.svelte"
    import { Modal } from "$lib/js/modalStore"
    import { hideModal } from "$lib/js/showModal"
    import { loginFrontEndUser, logoutFrontEndUser } from "$lib/js/loginUser"
    import { FrontEndUser } from "$lib/js/userStore"

   /**
     * @type {{email: string | undefined; firstName: string | undefined; lastName: string | undefined;}}
     */
    let user
    FrontEndUser.subscribe((value) =>  { user = value })
    /**
     * @type {boolean}
     */
    $: userIsAuthenticated = user.email && user.firstName && user.lastName ? true : false
    /**
     * @type {boolean}
     */
    let modal
    Modal.subscribe((value) =>  { modal = value })
    /**
     * @type {boolean}
     */
    $: showLogin = !userIsAuthenticated
    /**
     * @type {boolean}
     */
    $: showRegister = !userIsAuthenticated && !showLogin && !showChangePassword
    /**
     * @type {boolean}
     */
    $: showProfile = userIsAuthenticated
     /**
     * @type {boolean}
     */
    let showChangePassword
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
    /**
     * @type {string}
     */
    let changePasswordEmail
    /**
     * @type {boolean}
     */
    let verificationSent
     /**
     * @type {string[]}
     */
    let verificationReplies = []
    /**
     * @type {string}
     */
    let newPassword
    /**
     * @type {string}
     */
    let verificationCode
    /**
     * @type {boolean}
     */
     let passwordChanged
     /**
     * @type {string[]}
     */
    let changePasswordReplies = []

    /**
     * @type {string[]}
     */
    let verifyEmailReplies = []
    /**
     * @type {string}
     */
    let verificationCodeForEmail
    /**
     * @type {boolean}
     */
    let verified

   async function createUser(){
        registerReplies = []
        let form = {
            email: registerEmail,
            firstName: firstName,
            lastName: lastName,
            password: registerPassword
        }
        if(!form.email || !form.firstName || !form.lastName || !form.password){
            registerReplies.push("please fill out all the fields.")
            return
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
   }

   function resetForms(){
        loginEmail = ""
        loginPassword = ""
        changePasswordEmail = ""
        newPassword = ""
        verificationCode = ""
        verificationCodeForEmail = ""
        registerEmail = ""
        firstName = ""
        lastName = ""
        registerPassword = ""
        loginSuccess = false
        loginReplies = []
        verifyEmailReplies = []
        registerSuccess = false
        registerReplies = []
        verificationSent = false
        verificationReplies = []
        showChangePassword = false
   }

   async function login(){
        loginReplies = []
        let form = {
            email: loginEmail,
            password: loginPassword
        }
        if(!form.email || !form.password){
            loginReplies.push("please fill out all the fields.")
            return
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
        verified = loginReplies[0] === "ok"
        if(verified) {
            let frontEndUser = message.payload
            loginFrontEndUser(frontEndUser.email, frontEndUser.firstName, frontEndUser.lastName)
            resetForms()
        }
   }

   async function forgotPassword(){
        verificationReplies = []
        let form = {
            email: changePasswordEmail
        }
        if(!form.email){
            verificationReplies.push("please fill out all the fields.")
            return
        }
        const reply = await fetch(`${PUBLIC_HOST}/user/forgot_password`,{ 
            method: 'POST',
            body: JSON.stringify(form),
            headers:{
                'content-type': 'application/json'
            }
        })
        const message = await reply.json()
        verificationSent = message.success
        verificationReplies = message.replies  
   }

   async function changePassword(){
        changePasswordReplies = []
        let form = {
            email: changePasswordEmail,
            password: newPassword,
            code: verificationCode
        }
        if(!form.email || !form.password || !form.code){
            changePasswordReplies.push("please fill out all the fields.")
            return
        }
        const reply = await fetch(`${PUBLIC_HOST}/user/change_password`,{ 
            method: 'POST',
            body: JSON.stringify(form),
            headers:{
                'content-type': 'application/json'
            }
        })
        const message = await reply.json()
        passwordChanged = message.success
        changePasswordReplies = message.replies

        if(passwordChanged) {
            let frontEndUser = message.payload
            loginFrontEndUser(frontEndUser.email, frontEndUser.firstName, frontEndUser.lastName)
            resetForms()
        }
    }

   /**
     * @param {string} email
     */
   async function verifyEmail(email){
        loginReplies = []
        registerReplies = []
        verifyEmailReplies = []
        let form = {
            email: email,
            code: verificationCodeForEmail
        }
        if(!form.email || !form.code){
            verifyEmailReplies.push("please fill out all the fields.")
            return
        }
        const reply = await fetch(`${PUBLIC_HOST}/user/verify_email`,{ 
            method: 'POST',
            body: JSON.stringify(form),
            headers:{
                'content-type': 'application/json'
            }
        })
        const message = await reply.json()
        let emailVerified = message.success
        verifyEmailReplies = message.replies

        if(emailVerified) {
            let frontEndUser = message.payload
            loginFrontEndUser(frontEndUser.email, frontEndUser.firstName, frontEndUser.lastName)
            resetForms()
        }
    }

   /**
     * @param {string} destination
    */
   function switchView(destination){
        showLogin = destination === "login"
        showRegister = destination === "register"
        showChangePassword = destination === "change_password"
   }
   async function logoutUser(){
        await logoutFrontEndUser()
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
        box-sizing: border-box;
        margin: 12vh calc( calc( 100vw - 400px ) / 2 ) 0 calc( calc( 100vw - 400px ) / 2 );
        max-height: 70vh;
        max-width: 400px;
        padding: 12px;
        position: fixed;
        overflow-y: auto;
        top: 0;
        width: 90%;
        z-index: 14;
    }
    .show{
        animation-name: appear_x;
        animation-duration: 800ms;
        animation-fill-mode: both;
        animation-timing-function: ease-out;
        display: grid;
    }
    .login, .register{
        box-sizing: border-box;
        display: block;
        padding: 0 0 12px 0;
        position: relative;
        width: 100%;
    }
    input{
        border: 1px solid var(--color_purple_translucent);
        border-radius: var(--border_radius_secondary);
        box-sizing: border-box;
        display: block;
        margin: 8px auto;
        padding: 0 25px;
        height: 50px;
        width: 100%;
    }
    .options{
        display: block;
        text-align: right;
        width: 100%;
    }
    h3{
        margin: 8px;
    }
    a{
        display: inline-block;
        margin: 8px 0 0 0;
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
@media only screen and (max-width: 600px){
    .modal{
        margin: 12vh calc( calc( 100vw - 360px ) / 2 ) 0 calc( calc( 100vw - 360px ) / 2 );
        max-width: 360px;
    }
}
@media only screen and (max-width: 400px){
    .modal{
        margin: 12vh 5% 0 5%;
        min-width: 240px;
        width: 90%;
    }
}
</style>
<div class="backdrop" style={ modal ? "" : "display: none;" } on:click={hideModal} on:keydown={hideModal}>
</div>
<div class="modal" style={ modal ? "" : "display: none;" }>
<!-- Start Login form -->
    <div class="login {showLogin ? "show" : ""}" style={ showLogin ? "" : "display: none;" }>
        <h3>Login</h3>
        <form name="login" on:submit|preventDefault={login} style="{loginSuccess ? "display: none" : ""}">
            <input name="email" type="email" placeholder="email" bind:value={loginEmail} required/>
            <input name="password" type="password" placeholder="password" bind:value={loginPassword} required/>
            <Button title="login" style="cta" />
        </form>
        <form name="verify_email" on:submit|preventDefault={()=>verifyEmail(loginEmail)} style="{!loginSuccess || verified ? "display: none" : ""}">
            <div class="reply success">
                <ul>
                    <li>You successfully created an account with us. We have sent a verification code to {loginEmail}. Enter the code below</li>
                </ul>
            </div>
            <input name="code" type="text" placeholder="verification code" bind:value={verificationCodeForEmail} required/>
            <Button title="verify" style="cta" />
        </form>
        <div class="options">
            <a on:click|preventDefault={()=>switchView("change_password")} href="/">forgot password?</a>
            <br />
            <a on:click|preventDefault={()=>switchView("register")} href="/"> Register instead &#x2192;</a>
        </div>
        {#if loginReplies.length > 0 && !loginSuccess}
            <div class="reply error">
                <ul>
                    {#each loginReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
        {/if}
        {#if verifyEmailReplies.length > 0 && showLogin}
            <div class="reply error">
                <ul>
                    {#each verifyEmailReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
<!-- End Login form -->
<!-- Start Register form -->
    <div class="register {showRegister ? "show" : ""}" style={ showRegister ? "" : "display: none;" }>
        <h3>Register</h3>
        <form name="register" on:submit|preventDefault={createUser} style="{registerSuccess ? "display: none" : ""}">
            <input name="email" type="email" placeholder="email" bind:value={registerEmail} required/>
            <input name="first_name" type="text" placeholder="first name" bind:value={firstName} required/>
            <input name="last_name" type="text" placeholder="last name" bind:value={lastName} required/>
            <input name="password" type="text" placeholder="password" bind:value={registerPassword} autocomplete="new-password" required/>
            <Button title="register" style="cta" />
        </form>
        <form name="verify_email" on:submit|preventDefault={()=>verifyEmail(registerEmail)} style="{!registerSuccess ? "display: none" : ""}">
            <div class="reply success">
                <ul>
                    <li>You successfully created an account with us. We have sent a verification code to {registerEmail}. Enter the code below</li>
                </ul>
            </div>
            <input name="code" type="text" placeholder="verification code" bind:value={verificationCodeForEmail} required/>
            <Button title="verify" style="cta" />
        </form>
        <div class="options">
            <a on:click|preventDefault={()=>switchView("login")} href="/">&#x2190; Login instead</a>
            <br />
            <a on:click|preventDefault={()=>switchView("change_password")} href="/">forgot password?</a>    
        </div>
        {#if registerReplies.length > 0 && !registerSuccess}
            <div class="reply error">
                <ul>
                    {#each registerReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
        {/if}
        {#if verifyEmailReplies.length > 0 && showRegister}
            <div class="reply error">
                <ul>
                    {#each verifyEmailReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
<!-- End Register form -->
<!-- Start Change Password form -->
    <div class="password {showChangePassword ? "show" : ""}" style={ showChangePassword ? "" : "display: none;" }>
        <h3>Forgot Password</h3>
        <form name="forgot_password" on:submit|preventDefault={forgotPassword} style="{verificationSent ? "display: none" : ""}">
            <input name="email" type="email" placeholder="email" bind:value={changePasswordEmail} required/>
            <Button title="send verification code" style="cta" />
        </form>
        <form name="change_password" on:submit|preventDefault={changePassword} style="{!verificationSent ? "display: none" : ""}">
            <div class="reply success">
                <ul>
                    <li>We have sent a verification code to {changePasswordEmail}. You can now change your password.</li>
                </ul>
            </div>
            <input name="new_password" type="text" placeholder="new password" bind:value={newPassword} autocomplete="new-password" required/>
            <input name="code" type="text" placeholder="verification code" bind:value={verificationCode} required/>
            <Button title="change password" style="cta" />
        </form>
        <div class="options">
            <a on:click|preventDefault={()=>switchView("login")} href="/">&#x2190; Login instead</a>
            <br />
            <a on:click|preventDefault={()=>switchView("register")} href="/">Register instead &#x2192;</a>
        </div>
        {#if verificationReplies.length > 0 && !verificationSent}
            <div class="reply error">
                <ul>
                    {#each verificationReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
        {/if}
        {#if changePasswordReplies.length > 0 && !passwordChanged}
            <div class="reply error">
                <ul>
                    {#each changePasswordReplies as reply}
                        <li>{ reply }</li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
<!-- End Change Password form -->
<!-- Start Profile form -->
    <div class="profile {showProfile ? "show" : ""}" style={ showProfile ? "" : "display: none;" }>
        <h3>{ user.firstName } { user.lastName }</h3>
        <div class="options">
            <a href="{PUBLIC_HOST}/user/logout" on:click|preventDefault={logoutUser}>logout</a>
        </div>
    </div>
</div>
