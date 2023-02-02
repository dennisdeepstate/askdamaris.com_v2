<script>
    import { afterUpdate, onMount } from "svelte"
    import { PUBLIC_HOST } from "$env/static/public";

    function mssgTime(){
        return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
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
         * @param {string} message
         * @param {string | undefined} time
         * @param {string} author
         */
        constructor(message, time, author){
            this.message = message,
            this.time =  time || mssgTime(),
            this.author = author;
        }
    }
    /**
     * @type {Object.<string, string>}
     */
    let form = {}
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
    let currentRequirement = 0
    let listOfRequirements = [{title: "name", message: "What's your name ?", error:"please enter a valid name"}, {title: "email", message: "what's your email address?", error:"please enter a valid email address"}, { title: "message", message: "leave us your message", error:"your message must be longer than a single character. thanks"}]
    /**
     * @param {Mssg []} chatMessages
     */
    let chatMessages = [new Mssg ("hi there", undefined,"bot")]
    $: if(contactOffset < scroll * 0.8 && chatMessages.length < 2) chatMessages = [...chatMessages, new Mssg (listOfRequirements[0].message, undefined,"bot")]

    async function scrollToBottomOfChat(){
        mssgBox.scroll({ top: mssgBox.scrollHeight, behavior: 'smooth' });
    }
    /**
     * @param {string} title
     * @param {string} inputMssg
     */
    function validateContactInput(title, inputMssg){
        if(title==="name"){ 
            return /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/.test(inputMssg)
        }
        if(title==="email") {
            return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(inputMssg)
        }
        if(title==="message") {
            return inputMssg.trim().length > 1
        }
    }
    
    async function sendMessage(){
        if(inputMssg.trim() === "" || inputMssg.trim() === undefined || currentRequirement >= listOfRequirements.length) return
        /**
        * @param {string} title
        */
        let title = listOfRequirements[currentRequirement].title
        form[title] = inputMssg
        inputMssg = ""
        chatMessages = [...chatMessages, new Mssg(form[title], undefined, "user")]

        async function botReply(){
            if( validateContactInput(title, form[title]) ){
                currentRequirement += 1
                if(currentRequirement >= listOfRequirements.length ){
                    const reply = await fetch(`${PUBLIC_HOST}/contact`,{ 
                        method: 'POST',
                        body: JSON.stringify(form),
                        headers:{
                            'content-type': 'application/json'
                        }
                    })
                    chatMessages = [...chatMessages, new Mssg(`Thank you, ${form.name}, We have received your message. Please keep checking your email for a reply from us`, undefined, "bot")]
                }else{
                    chatMessages = [...chatMessages, new Mssg(listOfRequirements[currentRequirement].message, undefined, "bot")]
                }
            }else{
                chatMessages = [...chatMessages, new Mssg(listOfRequirements[currentRequirement].error, undefined, "bot")]
            }
        }

    setTimeout(async() => await botReply(), 500)

    }
    onMount(() => {
        contactOffset = mssgBox.offsetTop - windowHeight
    })
    afterUpdate(() => {
        scrollToBottomOfChat()
    })
</script>
<style>
    .chatbox{
        background-color: var(--color_blackish_translucent);
        border-radius: var(--border_radius);
        height: 400px;
        margin: 0 auto 40px auto;
        max-width: 840px;
        min-width: 240px;
        padding: 40px 20px;

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
        padding: 0 10%;
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
            {/each}
        </div>
        <form on:submit|preventDefault={sendMessage}>
            <input type="text" placeholder="write your {listOfRequirements[currentRequirement >= listOfRequirements.length ? listOfRequirements.length - 1 : currentRequirement].title} here, then press enter to send." bind:value={inputMssg}/>
        </form>
    </div>
</section>