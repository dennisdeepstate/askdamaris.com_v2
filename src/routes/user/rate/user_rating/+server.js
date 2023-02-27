import { albums } from "$db/collections"
import { PUBLIC_HOST } from "$env/static/public"
import { redirect } from "@sveltejs/kit"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    let bunny_id = await request.json()
    if(!locals.user.email) redirect(302, `${PUBLIC_HOST}/videos/`)
    if(!bunny_id) return new Response("please fill out all the fields", {status: 403})

    let userRating
    const album = await albums.findOne({ "videos.bunny_id":  bunny_id })
    if(!album) return new Response("video does not exist", {status: 403})

    const video = (album.videos.filter((/** @type {{ bunny_id: string; }} */ videos) => videos.bunny_id === bunny_id))[0]

    if(video.ratings.length > 0){
        userRating = (video.ratings.filter((/** @type {{ email: string | null; }} */ rating) => rating.email === locals.user.email))[0]
    }

    return new Response(userRating ? JSON.stringify(userRating.rate) : "0", {status: 200})
    
}