import { albums } from "$db/collections"
import { PUBLIC_HOST } from "$env/static/public"
import { redirect } from "@sveltejs/kit"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    let rating = await request.json()
    if(!locals.user.email) redirect(302, `${PUBLIC_HOST}/videos/`)
    if(!rating.rate || !rating.bunny_id) return new Response("please fill out all the fields", {status: 403})

    const updateRate = await albums.updateOne(
        {
            "videos.bunny_id": rating.bunny_id,
            "videos.ratings.email": locals.user.email
        },
        {
            $set : {"videos.$[video].ratings.$[rating].rate" : parseInt(rating.rate), "videos.$[video].ratings.$[rating].email" : locals.user.email}
        },
        {   
            arrayFilters: [{"video.bunny_id": rating.bunny_id},{"rating.email": locals.user.email}]
        }
    )

    if(updateRate.modifiedCount === 0){
        albums.updateOne(
        {
            "videos.bunny_id": rating.bunny_id,
        },
        {
            $push : {"videos.$[video].ratings" : { email: locals.user.email, rate: parseInt(rating.rate) } }
        },
        {   
            arrayFilters: [{"video.bunny_id": rating.bunny_id}]
        })
    }

    let ratings
    let newRating
    const album = await albums.findOne({ "videos.bunny_id":  rating.bunny_id })
    if(!album) return new Response("video does not exist", {status: 403})

    const video = (album.videos.filter((/** @type {{ bunny_id: string; }} */ videos) => videos.bunny_id === rating.bunny_id))[0]

    if(video.ratings.length > 0){
        ratings = video.ratings.map((/** @type {{ rate: number; }} */ rating) => rating.rate)
        newRating = (ratings.reduce((/** @type {number} */ a,/** @type {number} */ b)=> a+ b) / ratings.length).toFixed(1)
    }else{
        rating = 0.0
    }

    return new Response(JSON.stringify(newRating), {status: 200})
    
}