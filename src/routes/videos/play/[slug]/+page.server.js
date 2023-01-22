import { BUNNY_EMBED_TOKEN } from '$env/static/private'
import { PUBLIC_HOST } from '$env/static/public'
import { albums, videos } from '$db/collections'
import { redirect } from '@sveltejs/kit'

/**
 * @param {ArrayBufferLike} buffer
 */
async function hex(buffer) {
    let digest = ''
    let view = new DataView(buffer)
    for(var i = 0; i < view.byteLength; i += 4) {
      let value = view.getUint32(i)
      let stringValue = value.toString(16)
      let padding = '00000000'
      let paddedValue = (padding + stringValue).slice(-padding.length)
      digest += paddedValue
    } 
    return digest
}

/**
 * @param {string | undefined} str
 */
async function sha256(str) {
    let buffer = new TextEncoder().encode(str)
    return await crypto.subtle.digest("SHA-256", buffer)
}

/** @type {import('./$types').PageServerLoad} */
export async function load({params}){
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