import { sessions, users, verificationCodes } from "$db/collections"
import { NODE_ENV } from "$env/static/private"
import { Reply, Session } from "$lib/js/session"
import { hex, sha256 } from "$lib/js/sha256"
import { validateInput } from "$lib/js/validateInput"


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

    let user = await request.json()
    let reply = new Reply(false, [])

    user.email = user.email.toLowerCase()
    if(!validateInput("password", user.password)) reply.replies.push("password must be atleast 8 characters long. Must also contain special characters, numbers, small and capital letters")
    if(reply.replies.length > 0) return new Response(JSON.stringify(reply),{status: 200})

    const findUser = await users.findOne({email: user.email})
    if(!findUser) return new Response(JSON.stringify(new Reply(false, ['the email you entered is either not valid or is not registered on askdamaris.com'])),{status: 200})

    const verify = await verificationCodes.findOne({email: user.email, code: user.code})
    if(!verify) return new Response(JSON.stringify(new Reply(false, ['the code you entered is not valid'])),{status: 200})

    const currentTimeStamp = Math.floor(Date.now() / 1000)
    if(currentTimeStamp > verify.expiry) return new Response(JSON.stringify(new Reply(false, ['the code you entered has expired'])),{status: 200})

    const expiryTimeStamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 2)
    user.password = await hex(await sha256(user.password))
    await users.updateOne({email: user.email}, { $set: { password: user.password } })
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

    reply = new Reply(true, [`password successfully changed!`])
    return new Response(JSON.stringify(reply),{ status: 200})

}