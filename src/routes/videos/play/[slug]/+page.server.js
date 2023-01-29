import { BUNNY_EMBED_TOKEN } from '$env/static/private'
import { PUBLIC_HOST } from '$env/static/public'
import { albums, videos } from '$db/collections'
import { redirect } from '@sveltejs/kit'
import { hex, sha256} from '$lib/js/sha256'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params}){
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + 43200
    const bunnyId = params.slug
    const video = await videos.findOne({bunny_id: bunnyId})

    if(!video) throw redirect(302, `${PUBLIC_HOST}/videos/`)

    const parentAlbum = await albums.findOne({ name: video.album })
    const playToken = await hex(await sha256(`${BUNNY_EMBED_TOKEN}${bunnyId}${expiryTimeStamp}`))

    return{
        bunnyId: bunnyId,
        title: video.title,
        album: video.album,
        playToken: playToken,
        expiryTimeStamp: expiryTimeStamp,
        relatedVideos: parentAlbum ? parentAlbum.videos : []
    }
}