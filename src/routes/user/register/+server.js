import { users } from "$db/collections"

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
}

class Reply{
    /**
     * @param {boolean} success
     * @param {String []} replies
     */
    constructor(success, replies){
        this.success = success,
        this.replies = replies
    }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let user = await request.json()
    let reply = new Reply(false, [])
    
    if(!validateInput("email", user.email)) reply.replies.push("please enter a valid email address")
    if(!validateInput("name", user.fisrtName)) reply.replies.push("please enter a real first name")
    if(!validateInput("name", user.lastName)) reply.replies.push("please enter a real last name")

    if(reply.replies.length > 0) return new Response(JSON.stringify(reply),{status: 200})

    let success = await users.insertOne(user)

    if(success) reply = new Reply(true, ["your account has been successfully created"])

    return new Response(JSON.stringify(reply),{status: 200})

}
