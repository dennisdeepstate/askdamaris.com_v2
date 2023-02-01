import { albums } from "$db/collections"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    let rating = await request.json()

    const updateRate = await albums.updateOne(
        {"videos.bunny_id": rating.bunny_id},
        { $set : {"videos.$[video].ratings.$[rating].rate" : parseInt(rating.rate), "videos.$[video].ratings.$[rating].email" : locals.user.email}},
        {arrayFilters: [{"video.bunny_id": rating.bunny_id},{"rating.email": locals.user.email}]}
        )
        
    return new Response("", {status: 200})
}