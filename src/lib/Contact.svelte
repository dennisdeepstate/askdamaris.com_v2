<script>
    import { afterUpdate, onMount } from "svelte"
    import { PUBLIC_HOST } from "$env/static/public"
    import { validateInput } from "$lib/js/validateInput";

    function mssgTime(){
        return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    onMount(() => {
        contactOffset = mssgBox.offsetTop - windowHeight
    })
    /**
     * @type {number}
     */
     let scroll
    /**
     * @type {number}
     */
    let windowHeight
    class Mssg{
        /**
         * @param {string } message
         * @param {string | undefined} time
         * @param {string} author
         * @param {string [] | undefined} buttons
         */
        constructor(message, time, author, buttons = []){
            this.message = message,
            this.time =  time || mssgTime(),
            this.author = author
            this.buttons = buttons
        }
    }
    /**
     * @type {HTMLInputElement}
     */
    let submitBtn
    /**
     * @type {HTMLFormElement}
     */
    let form
    /**
     * @type {string}
     */
    let inputMssg
    /**
     * @type {HTMLElement}
     */
    let mssgBox
    /**
     * @type {number}
     */
    let contactOffset
    /**
     * @type {Mssg []}
     */
    let chatMessages = [new Mssg ("hi there", undefined,"bot")]
    /**
     * @type {{title: string; mssg: string; errorMssg: string; buttons: string [], next: any} []}
     */
    let modes = [
        {
            title: "name",
            mssg: "What is your full name?",
            errorMssg: "the email you entered is not a valid email address. Please try again",
            buttons: [],
            next:()=>"email"
        },
        {
            title: "email",
            mssg: "What is your email address",
            errorMssg: "the email you entered is not a valid email address. Please try again",
            buttons: [],
            next:()=>"phone"
        },
        {
            title: "phone",
            mssg: "What is your phone number",
            errorMssg: "the phone number you entered is not a valid phone number. Please try again",
            buttons: [],
            next:()=>"firstBranch()"
        },
        {
            title: "topic",
            mssg: "What topics are you interested in?",
            errorMssg: " ",
            buttons: [],
            next: ()=>"objectives",
        },
        {
            title: "message",
            mssg: "Please leave us a message",
            errorMssg: "a message cannot be shorter than 3 character",
            buttons: [],
            next: ()=>"end",
        },
        {
            title: "objectives",
            mssg: "What are your key objectives?",
            errorMssg: " ",
            buttons: [],
            next: ()=>"secondBranch()",
        }
    ]

    let selections
    let firstMessage = {
        title: "intro",
        mssg: "What topics are you interested in?",
        errorMssg: "please select a valid option",
        buttons: ["leave us a message", "corporate training", "individual consultation", "speaking engagement"],
        next: ()=>"name",
    }
    let currentMode = firstMessage

    $: if(contactOffset < scroll - ( windowHeight * 0.3 ) && chatMessages.length <= 1){
        chatMessages = [...chatMessages, new Mssg (firstMessage.mssg, undefined,"bot",firstMessage.buttons)]
    }
    $: console.log(chatMessages)

    async function scrollToBottomOfChat(){
        mssgBox.scroll({ top: mssgBox.scrollHeight, behavior: 'smooth' });
    }

    async function sendMessage(){
        chatMessages = [...chatMessages, new Mssg(inputMssg,undefined,"user")]
        async function botReply(){
            if( currentMode.buttons.length > 0){
                if(!currentMode.buttons.includes(inputMssg)){
                    chatMessages = [...chatMessages, new Mssg(currentMode.errorMssg,undefined,"bot")]
                }else{
                    selections.push({title: currentMode.title, selection: inputMssg})
                }
            }else{
                //validate
            }
        }

    setTimeout(async() => await botReply(), 500)

    }
    afterUpdate(() => {
        scrollToBottomOfChat()
    })
    /**
     * @param {string} button
     */
    function replyByButton(button){
        inputMssg = button
        submitBtn.click()
    }
</script>
<style>
    .chatbox{
        background-color: var(--color_blackish_translucent);
        border-radius: var(--border_radius);
        height: 400px;
        margin: 0 auto 40px auto;
        max-width: 840px;
        min-width: 240px;
        padding: 40px 0;

    }
    .chatbox > form >input[type="text"]{
        border: none;
        border-radius: var(--border_radius_secondary);
        display: block;
        margin: 0 auto;
        padding: 0 25px;
        height: 50px;
        width: 80%;
    }
    .chatbox > .message_box{
        height: 360px;
        padding: 0 5%;
        overflow-y: auto;
    }
    .message{
        animation-name: appear;
        animation-duration: 500ms;
        animation-fill-mode: both;
        animation-timing-function: ease-out;
        display: grid;
        margin: 8px 0;
    }
    .message_box > .selections{
        animation-name: appear;
        animation-duration: 500ms;
        animation-fill-mode: both;
        animation-timing-function: ease-out;
        display: grid;
        gap: 4px;
        grid-template-columns: 1fr 1fr;
        padding: 2px;
        width: 50%;
    }
    .message_box > .selections > button{
        background-color: rgba(25, 25, 25, 0.02);
    }
    .message_box > .selections > button:hover{
        background-color: rgba(25, 25, 25, 0.05);
    }
    .message > p{
        box-sizing: border-box;
        border-radius: var(--border_radius_secondary);
        margin: 2px 0;
        min-height: 25px;
        padding: 10px 25px;
        width: 50%;
        word-wrap: break-word;
    }
    .message > .time{
        color: var(--color_blackish);
        display: block;
        font-size: 12px;
        opacity: 0.6;
        text-align: right;
        width: 50%;
    }
    .message.bot > p{
        background-color: var(--color_purple_lite);
        color: var(--color_purple_main);
    }
    .message.user > *{
        justify-self: right;
    }
    .message.user > p{
        background-color: var(--color_orange_lite);
        color: var(--color_orange_main);
    }
    .message.user > .time{
        text-align: right;
    }
</style>
<svelte:window bind:scrollY={scroll} bind:innerHeight={windowHeight}/>
<section id="contact">
    <h2>si you slide into our diems kidogo</h2>
    <div class="chatbox">
        <div class="message_box" bind:this={mssgBox}>
            {#each chatMessages as chatMessage}
                <div class="message {chatMessage.author}"><p>{chatMessage.message}</p><span class="time">{chatMessage.time}</span></div>
                {#if chatMessage.buttons.length > 0}
                    <div class="selections">
                        {#each chatMessage.buttons as button}
                            <button on:click={()=>replyByButton(button)}>{ button }</button>
                        {/each}
                    </div>
                {/if}
            {/each}
        </div>
        <form on:submit|preventDefault={sendMessage} bind:this={form}>
            <input type="text" placeholder="write your  here, then press enter to send." bind:value={inputMssg}/>
            <input type="submit" style="display: none;" bind:this={submitBtn}/>
        </form>
    </div>
</section>
<!-- 
    mode = name
    modes = [{ title: name; buttons[]; error; next}]
    find mode.
    if reply is successful (if buttons.length > 0 switch mode to reply else switch mode to next)
 -->