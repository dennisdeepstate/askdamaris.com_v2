import { albums } from '$db/collections'
import { PUBLIC_HOST } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }){

    const albumTitle = params.slug
    const album = await albums.findOne({ name: albumTitle })
    if(!album) throw redirect(307, `${PUBLIC_HOST}/videos`)

    return{
        album: albumTitle,
        price: album.price,
        videos: album.videos
    }

}