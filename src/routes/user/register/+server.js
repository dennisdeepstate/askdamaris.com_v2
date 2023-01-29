import { users, sessions } from "$db/collections"
import { hex, sha256} from '$lib/js/sha256'
import { NODE_ENV } from "$env/static/private"
import { Reply, Session } from "$lib/js/session"

/**
 * @param {string} title
 * @param {string} input
 */
function validateInput(title, input){
    if(title==="name"){ 
        return /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/.test(input)
    }
    if(title==="email") {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(input)
    }
    if(title==="password"){
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*()<>_=+'";:{},[.`~\]\-\/\\\|]).{8,}$/.test(input)
    }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

    let user = await request.json()
    let reply = new Reply(false, [])
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 2)

    if(!validateInput("email", user.email)) reply.replies.push("please enter a valid email address")
    if(!validateInput("name", user.firstName)) reply.replies.push("please enter a real first name")
    if(!validateInput("name", user.lastName)) reply.replies.push("please enter a real last name")
    if(!validateInput("password", user.password)) reply.replies.push("password must be atleast 8 characters long. Must also contain special characters, numbers, small and capital letters")

    if(reply.replies.length > 0) return new Response(JSON.stringify(reply),{status: 200})
    user.password = await hex(await sha256(user.password))
    if(await users.findOne({email: user.email})) return new Response(JSON.stringify(new Reply(false, ['This email is already registered, try to login instead'])),{status: 200})

    await users.insertOne(user)
    const cookieId = crypto.randomUUID()
    await sessions.insertOne(new Session(cookieId, user.email, request.headers.get('user-agent'), expiryTimeStamp))

    cookies.set('askdamaris_sess', cookieId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV === "Prod",
        maxAge: 60 * 60 * 24 * 2
    })

    reply = new Reply(true, ["your account has been successfully created"])
    return new Response(JSON.stringify(reply),{status: 200})

}
