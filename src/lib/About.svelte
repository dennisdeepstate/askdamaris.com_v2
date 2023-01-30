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
            title: "Sessions",
            body:"We offer tailored instructions and work in partnership with you to achieve your objectives in:",
            list: ["setting, monitoring and taking responsibility for your goals", "enhancing self-worth and confidence", "improving communication abilities", "developing interpersonal skills", "public speaking and presentation", "creating a personal brand", "preparing for interviews"]
        },
        {
            title: "Training & Workshops",
            body:"At ask damaris, we offer personalized training for your team. Our approach is tailored to meet your specific needs through the creation of unique solutions, hands-on writing sessions and feedback-based evaluations. our areas of expertise include:",
            list: ["customer service training", "business and email etiquette", "leadership and management training", "workshop and fostering creativity and innovation", "time management and productivity workshops", "change management workshops"]
        },
        {
            title: "Meet our founder",
            body:"Damaris Mwikali is a dynamic leader with a proven track record of building and leading high-performing teams. \n\nHer passion is to empower and inspire the next generation to embrace positive change and discover their true purpose. She is reliable, energetic and a firm believer in the power of ongoing learning and self improvement. \n\nThrough her experiences and expertise, Damaris aims to ignite transformation and make a meaningful impact on people's lives . \n\nJoin her on this journey of self-discovery and let her be your guide as you confidently chase your dreams and strive to become the best version of yourself.",
            list: []
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
    .about_card > .about_content > p{
        white-space: pre-line;
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