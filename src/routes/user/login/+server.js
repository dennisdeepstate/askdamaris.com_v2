import { users, sessions } from "$db/collections"
import { hex, sha256} from '$lib/js/sha256'
import { NODE_ENV } from "$env/static/private"
import { Reply, Session } from "$lib/js/session"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

    let user = await request.json()
    let reply = new Reply(false, [])
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 2)

    user.password = await hex(await sha256(user.password))
    const findUser = await users.findOne({email: user.email})
    if(!findUser || findUser.password !== user.password) return new Response(JSON.stringify(new Reply(false, ['the email and password combination you entered do not match'])),{status: 200})

    const cookieId = crypto.randomUUID()
    await sessions.insertOne(new Session(cookieId, findUser.email, request.headers.get('user-agent'), expiryTimeStamp))

    cookies.set('askdamaris_sess', cookieId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV === "Prod",
        maxAge: 60 * 60 * 24 * 2
    })

    reply = new Reply(true, ["login was successful"])
    return new Response(JSON.stringify(reply),{ status: 200})

}
