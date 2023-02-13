import { messages } from "$db/collections"
import { validateInput } from "$lib/js/validateInput";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let mssg = await request.json()
    mssg.forEach((/** @type {{ title: string; selection: string; }} */ element) => {
        if(!validateInput(element.title, element.selection)) return new Response(JSON.stringify('fail'),{status: 403})
    })

    let saveMessage = await messages.insertOne({mssg})

    return new Response(JSON.stringify(saveMessage ? 'ok' : 'fail'),{status: 200})

}

