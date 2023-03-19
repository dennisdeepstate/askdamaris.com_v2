import { albums, users } from '$db/collections'
import { PUBLIC_HOST } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }){

    const albumTitle = params.slug
    const album = await albums.findOne({ name: albumTitle })
    if(!album) throw redirect(307, `${PUBLIC_HOST}/videos`)
    const userMatchedToPurchase = await users.findOne({email: locals.user.email, "albums.name": albumTitle })
    if(userMatchedToPurchase) throw redirect(307, `${PUBLIC_HOST}/videos/play/${album.videos[0].bunny_id}`)

    return{
        album: albumTitle,
        price: album.price,
        videos: album.videos
    }

}