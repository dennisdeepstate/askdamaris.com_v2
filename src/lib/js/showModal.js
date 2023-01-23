import { Modal } from '$lib/js/modalStore.js'

function hideModal() {
    Modal.set(false)
}
function showModal() {
    Modal.set(true)
}

export{
    hideModal,
    showModal
}