import { albums } from '$db/collections'
import { PUBLIC_HOST } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals}){

    let buyLocked = false
    const albumTitle = params.slug
    const album = await albums.findOne({ name: albumTitle })
    if(!album) throw redirect(307, `${PUBLIC_HOST}/videos`)
    if(!locals.user.email) buyLocked = true

    return{
        album: albumTitle,
        buyLocked: buyLocked,
        price: album.price,
        videos: album.videos
    }

}