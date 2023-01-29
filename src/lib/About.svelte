<script>
    import { afterUpdate } from 'svelte'
    /**
     * @type {any}
     */
    let scroll
    /**
     * @type {HTMLElement}
     */
    let about
    /**
     * @type {number}
     */
    let aboutOffset
    /**
     * @type {number}
     */
    let cardHeight = 240
    /**
     * @type {any}
     */
    let windowHeight
    /**
     * @param {number} pos
     * @param {number} scroll
     */
    function getWalk(pos, scroll){
        return scroll >= aboutOffset +  ( pos * cardHeight ) + 80 ? ( ( scroll - ( aboutOffset +  ( pos * cardHeight ) ) ) * 0.1 )  : 0
    }
    afterUpdate(() => {
        aboutOffset = about.offsetTop - windowHeight
	})
    /**
     * @type {Array.<Object.<string, string | Array.<string>>>}
     */
    let aboutCards = [
        {
            title: "One on One consultations",
            body:"We provide lessons and work closely with you to attain your desired level when it comes to your:",
            list: ["professional development", "business etiquette", "personal branding"]
        },
        {
            title: "Training & Workshops",
            body:"Get customized training sessions for your team. Our model is designed to cater to your needs by creating innovative solutions, conducting writing sessions and value based review and evaluation. We specialize in:",
            list: ["customer service", "email etiquette", "effective communication", "public speaking"]
        },
        {
            title: "Business Process Outsourcing",
            body:"Our team of highly qualified personel are determined in making your business productive. Partner with us today and let us take care of your operations. We offer services in:",
            list: ["data entry", "email handling", "customer support", "internet and web research"]
        }
    ]
</script>
<style>
    .about_card, .gradient_border{
        border-radius: var(--border_radius);
        min-height: 200px;
        min-width: 240px;
        max-width: 840px;
        width: 100%;
    }
    .about_card{
        background: var(--color_white_translucent);
        display: grid;
        z-index: 8;
    }
    .gradient_border{
        background: var(--gradient);
        margin: 0 auto 40px auto;
        padding: 2px;
        z-index: 7;
    }
    .about_card > img{
        border-radius: var(--border_radius);
        margin: 0 -10px -40px 0;
        min-height: 200px;
        position: absolute;
        justify-self: right;
        width: 200px;
    }
    .about_card > .about_content{
        box-sizing: border-box;
        justify-self: left;
        padding: 20px;
        width: calc(100% - 210px);
    }
    @media only screen and (max-width: 600px){
        .about_card{
            grid-template-columns: 1fr;
        }
        .about_card > img {
            grid-row: 1;
            min-height: 180px;
            position: relative;
            justify-self: center;
            width: 180px;
        }
        .about_card > .about_content{
            justify-self: left;
            width: 100%;
        }
    }
</style>
<svelte:window bind:scrollY={scroll} bind:innerHeight={windowHeight}/>
<section id="about" bind:this={about}>
    <h2>Ka-something small about us</h2>
    {#each aboutCards as card, i}
    <div class="gradient_border">
        <div class="about_card">
            <div class="about_content">
                <h3>{ card.title }</h3>
                <p>{ card.body }</p>
                <ul>
                    {#each card.list as list}
                        <li>{ list }</li>
                    {/each}
                </ul>
            </div>
            <img src="#" alt="" style="transform: translateY({ Math.min( getWalk(i, scroll), 50 ) * -1 }px) rotateZ({ Math.min(getWalk(i, scroll) * 0.2, 8) }deg);"/>
        </div>
    </div>
    {/each}
</section>