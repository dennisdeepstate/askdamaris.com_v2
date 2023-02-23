import { BUNNY_EMBED_TOKEN } from '$env/static/private'
import { PUBLIC_HOST } from '$env/static/public'
import { albums, users } from '$db/collections'
import { redirect } from '@sveltejs/kit'
import { hex, sha256} from '$lib/js/sha256'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals}){
    let rate
    let ratings
    let rating
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + 43200
    const bunnyId = params.slug
    const album = await albums.findOne({ "videos.bunny_id":  bunnyId })

    if(!album) throw redirect(302, `${PUBLIC_HOST}/videos/`)

    const video = (album.videos.filter(( /** @type {{ bunny_id: string; }} */ videos) => videos.bunny_id === bunnyId))[0]

    if(video.premium){
        if(!locals.user.email) throw redirect(307, `${PUBLIC_HOST}/buy/${album.name}`)
        const paid = await users.findOne({ email: locals.user.email, "albums.name": album.name })
        if(!paid) throw redirect(307, `${PUBLIC_HOST}/buy/${album.name}`)
    }

    if(locals.user.email) {
        rate = (video.ratings.filter((/** @type {{ email: string | null; }} */ rating) => rating.email === locals.user.email))[0]
    }
    if(video.ratings.length > 0){
        ratings = video.ratings.map((/** @type {{ rate: number; }} */ rating) => rating.rate)
        rating = (ratings.reduce((/** @type {number} */ a,/** @type {number} */ b)=> a+ b) / ratings.length).toFixed(1)
    }else{
        rating = 0.0
    }
    
    const playToken = await hex(await sha256(`${BUNNY_EMBED_TOKEN}${bunnyId}${expiryTimeStamp}`))
    
    return{
        bunnyId: bunnyId,
        title: video.title,
        userRating: rate ? JSON.stringify( rate.rate ): "0",
        rating: rating,
        album: album.name,
        playToken: playToken,
        expiryTimeStamp: expiryTimeStamp,
        relatedVideos: album.videos
    }
}