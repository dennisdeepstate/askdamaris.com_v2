<script>
    import { PUBLIC_HOST } from "$env/static/public";
    import Button from "$lib/Button.svelte"
    import { showModal } from "$lib/js/showModal"
    import { validateInput } from "$lib/js/validateInput";

    /**
     * @type {string}
     */
    export let albumName
    /**
     * @type {{ title: string; thumb: string; } []}
     */
     export let videos
    /**
     * @type {number}
     */
    export let price
    /**
     * @type {boolean}
     */
    export let buyLocked
    /**
     * @type {string}
     */
    let phone
    /**
     * @type {{ success: boolean; mssg: string; } | undefined}
     */
    let reply
    async function handleSubmit(){
        reply = undefined
        if(buyLocked){
            showModal()
            return
        }
        if(!validateInput("phone", phone)){
            reply = {
                success: false,
                mssg: "please enter a valid phone number"
            }
            return
        }
        const pushMpesa = await fetch(`${PUBLIC_HOST}/buy/stk`,
            {
                method: 'POST',
                body: JSON.stringify({
                    phone: phone,
                    album: albumName
                }),
                headers:{
                    'content-type': 'application/json'
                }
            }
        )

        reply = await pushMpesa.json()
    }
</script>
<style>
    input{
        border: 1px solid var(--color_purple_translucent);
        border-radius: var(--border_radius_secondary);
        display: block;
        margin: 12px 0;
        padding: 0 25px;
        height: 50px;
        width: 80%;
    }
    .buy_container{
        margin: 12px auto;
        max-width: 480px;
        padding: 8px;
        width: 80%;
    }
    ul{
        margin: 0;
        padding: 0;
    }
    ul > li{
        display: grid;
        gap: 8px;
        grid-template-columns: 1fr 5fr;
        margin: 12px 0;
        padding: 0;
    }
    ul > li >span{
        overflow: hidden;
    }
    img{
        height: 54px;
        overflow: hidden;
        object-fit: contain;
        width: 96px;
    }
    form{
        margin: 72px 0 0 0;
    }
    .reply{
        border-radius: var(--border_radius);
        box-sizing: border-box;
        margin: 12px 0;
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
<section id="buy">
    <div class="buy_container">
        <h3>{ albumName }</h3>
        <i>buy all {videos.length} videos for only {price}</i>
        <ul>
            {#each videos as video}
                <li><img src={video.thumb} alt="image for :{video.title}" /><span>{video.title}</span></li>
            {/each}
        </ul>
        <form on:submit|preventDefault={handleSubmit}>
            {#if reply}
                <div class="reply {reply.success ? "success" : "error"}">
                    { reply.mssg }
                </div>
            {/if}
            <label for="phone">Enter your MPESA phone number:</label>
            <input type="text" placeholder="2547xxxxxxxx" name="phone" id="phone" bind:value={phone} required/>
            <Button style="cta" title={`pay: KES${price}`}/>
        </form>
    </div>
</section>