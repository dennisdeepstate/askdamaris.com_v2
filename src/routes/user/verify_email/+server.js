import { sessions, users, verificationCodes } from "$db/collections"
import { NODE_ENV } from "$env/static/private"
import { Reply, Session } from "$lib/js/session"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

    let user = await request.json()
    if(!user.email || !user.code) return new Response(JSON.stringify(new Reply(false, ['please fill out all the fields'])),{status: 403})
    let reply = new Reply(false, [])

    const findUser = await users.findOne({email: user.email})
    if(!findUser) return new Response(JSON.stringify(new Reply(false, ['the email you entered is either not valid or is not registered on askdamaris.com'])),{status: 403})

    const verify = await verificationCodes.findOne({email: user.email, code: user.code})
    if(!verify) return new Response(JSON.stringify(new Reply(false, ['the code you entered is not valid'])),{status: 403})

    const currentTimeStamp = Math.floor(Date.now() / 1000)
    if(currentTimeStamp > verify.expiry) return new Response(JSON.stringify(new Reply(false, ['the code you entered has expired'])),{status: 403})

    const expiryTimeStamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 2)
    await users.updateOne({email: user.email}, { $set: { verified: true } })
    await verificationCodes.deleteOne({email: user.email})
    
    const cookieId = crypto.randomUUID()
    await sessions.insertOne(new Session(cookieId, findUser.email, request.headers.get('user-agent'), expiryTimeStamp))

    cookies.set('askdamaris_sess', cookieId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV === "Prod",
        maxAge: 60 * 60 * 24 * 2
    })

    reply = new Reply(true, [`successfully logged in`], {email: findUser.email, firstName: findUser.firstName, lastName: findUser.lastName})
    return new Response(JSON.stringify(reply),{ status: 200})

}