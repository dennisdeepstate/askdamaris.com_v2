<script>
    import { page } from '$app/stores'
  
    $: {
      if (typeof gtag !== 'undefined') {
        gtag('config', 'G-1V6M2876N2', {
          page_title: document.title,
          page_path: $page.url.pathname,
        })
      }
    }
</script>
  
<svelte:head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1V6M2876N2"></script>
<script>
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    gtag('js', new Date())

    gtag('config', 'G-1V6M2876N2')
</script>
</svelte:head>

	

  