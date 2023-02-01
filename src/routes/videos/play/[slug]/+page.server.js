import { BUNNY_EMBED_TOKEN } from '$env/static/private'
import { PUBLIC_HOST } from '$env/static/public'
import { albums, users } from '$db/collections'
import { redirect } from '@sveltejs/kit'
import { hex, sha256} from '$lib/js/sha256'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals}){
    let rate
    let ratingLocked = true
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + 43200
    const bunnyId = params.slug
    const album = await albums.find({ "videos.bunny_id":  bunnyId }).toArray()

    if(album.length <= 0) throw redirect(302, `${PUBLIC_HOST}/videos/`)

    const video = album[0].videos.filter((/** @type {{ bunny_id: string; }} */ videos) => videos.bunny_id === bunnyId)

    if(video[0].premium){
        if(!locals.user.email) throw redirect(307, `${PUBLIC_HOST}/buy/${album[0].name}`)
        const paid = await users.findOne({ email: locals.user.email, "albums.name": album[0].name })
        if(!paid) throw redirect(307, `${PUBLIC_HOST}/buy/${album[0].name}`)
    }

    if(locals.user.email) {
        rate = JSON.stringify( (video[0].ratings.filter((/** @type {{ email: string | null; }} */ rating) => rating.email === locals.user.email))[0].rate )
        ratingLocked = false
    }
    const ratings = video[0].ratings.map((/** @type {{ rate: number; }} */ rating) => rating.rate)
    const rating = (ratings.reduce((/** @type {number} */ a,/** @type {number} */ b)=> a+ b) / ratings.length).toFixed(1)
    const playToken = await hex(await sha256(`${BUNNY_EMBED_TOKEN}${bunnyId}${expiryTimeStamp}`))

    return{
        bunnyId: bunnyId,
        title: video[0].title,
        rate: rate,
        rating: rating,
        ratingLocked: ratingLocked,
        album: album[0].name,
        playToken: playToken,
        expiryTimeStamp: expiryTimeStamp,
        relatedVideos: album[0].videos
    }
}