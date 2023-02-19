<script>
    import { afterUpdate, onMount } from "svelte"
    import { validateInput } from "$lib/js/validateInput"
    import { PUBLIC_HOST } from "$env/static/public";

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
     let inputMssgHTML
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
     * @type {{title: string; mssg: string; errorMssg: string; buttons: string [], type: string, next: function} []}
     */
    let modes = [
        {
            title: "name",
            mssg: "What is your full name?",
            errorMssg: "the email you entered is not a valid email address. Please try again",
            buttons: [],
            type: "name",
            next:()=>"email"
        },
        {
            title: "email",
            mssg: "What is your email address",
            errorMssg: "the email you entered is not a valid email address. Please try again",
            buttons: [],
            type: "email",
            next:()=>"phone"
        },
        {
            title: "phone",
            mssg: "What is your phone number? (format : 2547xxxxxxxx or 2541xxxxxxxx)",
            errorMssg: "the phone number you entered is not a valid phone number. Please try again. (format : 2547xxxxxxxx or 2541xxxxxxxx)",
            buttons: [],
            type: "phone",
            next:() => {
                let x = selections.find(select => select.title === "service")?.selection
                if(x === "leaving a message") return "message"
                if(x === "speaking engagement") return "activity"
                if(x === "corporate training" || x === "individual consultation") return "objectives"
                return "end"
            }
        },
        {
            title: "message",
            mssg: "Please leave us a message",
            errorMssg: "a message cannot be shorter than 3 character",
            buttons: [],
            type: "message",
            next: ()=>"end"
        },
        {
            title: "objectives",
            mssg: "What are your key objectives?",
            errorMssg: "a message cannot be shorter than 3 character",
            buttons: [],
            type: "message",
            next: () => {
                if(selections.find(select => select.title === "service")?.selection === "corporate training") return "date"
                return "end"
            }
        },
        {
            title: "activity",
            mssg: "What is the occasion? e.g. graduation, high school motivational talks",
            errorMssg: "a message cannot be shorter than 3 character",
            buttons: [],
            type: "message",
            next:()=> "date"
        },
        {
            title: "date",
            mssg: "Which day would you like to schedule this? (format: dd-mm-yyyy)",
            errorMssg: "please enter a valid date using this format dd-mm-yyyy",
            buttons: [],
            type: "date",
            next:()=> "hours"
        },
        {
            title: "hours",
            mssg: "How long would you like the session to last?",
            errorMssg: "please select a valid option",
            buttons: ["1 hour", "2 hours", "3 hours", "4 hours or more"],
            type: "message",
            next:()=> "budget"
        },
        {
            title: "budget",
            mssg: "What's your budget",
            errorMssg: "please select a valid option",
            buttons: ["below 10K", "10k to 30k", "30k to 50k", "50k or more"],
            type: "message",
            next:()=> "pax"
        },
        {
            title: "pax",
            mssg: "How many people will be attending?",
            errorMssg: "please select a valid option",
            buttons: ["below 50", "50 to 200", "200 to 500", "500 or more"],
            type: "message",
            next:()=> "end"
        }
        
    ]
    /**
     * @type {{ title: string; selection: string;}[]}
     */
    let selections = []
    let firstMessage = {
        title: "service",
        mssg: "What are you interested in?",
        errorMssg: "please select a valid option",
        buttons: ["leaving a message", "corporate training", "individual consultation", "speaking engagement"],
        type: "message",
        next: (/** @type {string} */ input) => {
            if(!selections.find(select => select.title === "email")) return "name"
            if(input === "leaving a message") return "message"
            if(input === "speaking engagement") return "activity"
            if(input === "corporate training" || input === "individual consultation") return "objectives"
            return "end"
        },
    }
    /**
     * @type {{title: String; mssg: String; errorMssg: String; buttons: String[]; type: string; next: function } | undefined}
     */
    let currentMode = firstMessage

    $: if(contactOffset < scroll - ( windowHeight * 0.3 ) && chatMessages.length <= 1){
        chatMessages = [...chatMessages, new Mssg (firstMessage.mssg, undefined,"bot",firstMessage.buttons)]
    }

    async function scrollToBottomOfChat(){
        mssgBox.scroll({ top: mssgBox.scrollHeight, behavior: 'smooth' });
    }

    async function sendMessage(){
        if(!currentMode) return
        chatMessages = [...chatMessages, new Mssg(inputMssg,undefined,"user")]
        async function botReply(){
            if(!currentMode) return
            if(currentMode.buttons.length > 0 && !currentMode.buttons.includes(inputMssg)){
                chatMessages = [...chatMessages, new Mssg(currentMode.errorMssg,undefined,"bot")]
                return
            }
            if(currentMode.buttons.length === 0 ){
                if(!validateInput(currentMode.type, inputMssg)){
                    chatMessages = [...chatMessages, new Mssg(currentMode.errorMssg,undefined,"bot")]
                    return
                }
            }
            selections.push({title: currentMode.title, selection: inputMssg})
            let next = currentMode.next(inputMssg)
            if(next === "end"){
                const sendContact = await fetch(`${PUBLIC_HOST}/contact`,{ 
                    method: 'POST',
                    body: JSON.stringify(selections),
                    headers:{
                        'content-type': 'application/json'
                    }
                })
                let success = (await sendContact.json()) === 'ok'
                if(success){
                    chatMessages = [...chatMessages, new Mssg(`Thank you, ${selections.find(select => select.title === "name")?.selection}, for contacting us. A member of our team will reach out to you`,undefined,"bot")]
                    currentMode = firstMessage
                    currentMode.mssg = "Are you interested in anything else?"
                    chatMessages = [...chatMessages, new Mssg (firstMessage.mssg, undefined,"bot",firstMessage.buttons)]
                    selections = selections.filter(selection => selection.title === "name" || selection.title === "email" || selection.title === "phone") 
                }else{
                    chatMessages = [...chatMessages, new Mssg(`Unfortunately, we could not send your message. Please refresh the page and try again`,undefined,"bot")]
                }
                inputMssg = ""
                return
            }
            currentMode = modes.find(mode => mode.title === next)
            inputMssg = ""
            if(currentMode) chatMessages = [...chatMessages, new Mssg(currentMode.mssg,undefined,"bot",currentMode.buttons)]
        }
        async function thinking(){
            return new Promise((resolve, reject) => {
                resolve(
                    setTimeout(async() => {
                        await botReply()
                        scrollToBottomOfChat()
                }, 500))
            })
        }
        await thinking()
        scrollToBottomOfChat()
    }
    /**
     * @param {string} button
     */
    function replyByButton(button){
        inputMssg = button
        submitBtn.click()
        inputMssgHTML.focus()
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
        margin: 2px auto 0  auto;
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
        margin-bottom: 4px;
        padding: 2px;
        width: 50%;
    }
    .message_box > .selections > button{
        background-color: var(--color_orange_lite);
        color: var(--color_orange_main);
    }
    .message_box > .selections > button:hover{
        color: var(--color_blackish);
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
@media only screen and (max-width: 900px){
    .message_box > .selections{
        grid-template-columns: 1fr;
    }
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
            <input type="text" placeholder="write your {currentMode ? currentMode.type : "message"} here then press enter to send." bind:value={inputMssg} bind:this={inputMssgHTML}/>
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