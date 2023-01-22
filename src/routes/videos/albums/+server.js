import { albums } from "$db/collections"


export async function GET() {

    const albumData = await albums.find().toArray()
    
    return new Response(JSON.stringify(albumData),{status: 200})
}
