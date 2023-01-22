import { messages } from "$db/collections"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let mssg = await request.json()
    let success = await messages.insertOne(mssg)

    return new Response(JSON.stringify(success ? 'ok' : 'fail'),{status: 200})

}

