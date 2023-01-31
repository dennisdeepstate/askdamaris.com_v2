import { BUNNY_EMBED_TOKEN } from '$env/static/private'
import { PUBLIC_HOST } from '$env/static/public'
import { albums } from '$db/collections'
import { redirect } from '@sveltejs/kit'
import { hex, sha256} from '$lib/js/sha256'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params}){
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + 43200
    const bunnyId = params.slug
    const album = await albums.find({ "videos.bunny_id":  bunnyId }).toArray()

    if(album.length <= 0) throw redirect(302, `${PUBLIC_HOST}/videos/`)

    const video = album[0].videos.filter((/** @type {{ bunny_id: string; }} */ videos) => videos.bunny_id === bunnyId)

    const playToken = await hex(await sha256(`${BUNNY_EMBED_TOKEN}${bunnyId}${expiryTimeStamp}`))

    return{
        bunnyId: bunnyId,
        title: video[0].title,
        album: album[0].name,
        playToken: playToken,
        expiryTimeStamp: expiryTimeStamp,
        relatedVideos: album[0].videos
    }
}