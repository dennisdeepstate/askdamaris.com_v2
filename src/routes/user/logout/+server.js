import { sessions } from "$db/collections"
import { PUBLIC_HOST } from "$env/static/public"
import { redirect } from "@sveltejs/kit"

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, locals}) {
    const sessionId = cookies.get('askdamaris_sess')
    await sessions.deleteOne({sessionId: sessionId})

    cookies.set('askdamaris_sess', '', {
        path: '/',
        expires: new Date(0)
    })
    locals.user = {
        authenticated: false,
        firstName: null,
        lastName: null,
        email: null
    }
    
    throw redirect(307, `${PUBLIC_HOST}/`)

}