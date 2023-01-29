<script>
    import Modal from "$lib/Modal.svelte"
    import Nav from "$lib/Nav.svelte"
    import Banner from "$lib/Banner.svelte"
    import Footer from "$lib/Footer.svelte";
    import { onMount } from "svelte";

    /**
     * @type {boolean}
     */
    let loading
    
    onMount(()=>{
        loading = false
    })
    
</script>
<Modal />
<Nav />
<Banner loading={ loading } />
<slot></slot>
<Footer />