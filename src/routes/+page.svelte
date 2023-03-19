<script>
    import Hero from "$lib/Hero.svelte"
    import Line from "$lib/Line.svelte"
    import About from "$lib/About.svelte"
    import Contact from "$lib/Contact.svelte"
    import Spacer from "$lib/Spacer.svelte"
        /**
     * @type {import('./$types').PageData}
     */
    export let data
</script>
<svelte:head>
    <title>Karibu | askdamaris</title>
</svelte:head>
<Hero album={data.albums[0]}/>
<Spacer />
<Line />
<About />
<Line />
<Contact />

