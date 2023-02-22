<script>
    import Modal from "$lib/Modal.svelte"
    import Nav from "$lib/Nav.svelte"
    import Banner from "$lib/Banner.svelte"
    import Footer from "$lib/Footer.svelte"
    import { onMount } from "svelte"
    import { loginFrontEndUser } from "$lib/js/loginUser"

    export let data
    /**
     * @type {boolean}
     */
    let loading
    
    onMount(()=>{
        loading = false
    })

    if(data.user.email && data.user.firstName && data.user.lastName) loginFrontEndUser(data.user.email, data.user.firstName, data.user.lastName)
    
</script>
<Nav />
<Banner loading={ loading } />
<slot></slot>
<Footer />
<Modal />