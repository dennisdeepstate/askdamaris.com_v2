import { users, verificationCodes } from "$db/collections"
import { hex, sha256} from '$lib/js/sha256'
import { Reply} from "$lib/js/session"
import { validateInput } from "$lib/js/validateInput"
import { ZOHO_USER } from "$env/static/private"
import { writeEmail } from "$lib/js/email"
import { transporter } from "$mail/nodemailer"


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let user = await request.json()
    let reply = new Reply(false, [])

    user.email = user.email.toLowerCase()

    if(!validateInput("email", user.email)) reply.replies.push("please enter a valid email address")
    if(!validateInput("name", user.firstName)) reply.replies.push("please enter a real first name")
    if(!validateInput("name", user.lastName)) reply.replies.push("please enter a real last name")
    if(!validateInput("password", user.password)) reply.replies.push("password must be atleast 8 characters long. Must also contain special characters, numbers, small and capital letters")

    if(reply.replies.length > 0) return new Response(JSON.stringify(reply),{status: 200})
    user.password = await hex(await sha256(user.password))
    if(await users.findOne({email: user.email})) return new Response(JSON.stringify(new Reply(false, ['This email is already registered, try to login instead'])),{status: 200})

    user.verified = false
    await users.insertOne(user)
    
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + (60 * 30)
    const code = Math.floor(Math.random() * 100000).toString()

    if(await verificationCodes.findOne({email: user.email})){
        await verificationCodes.updateOne({email: user.email}, { $set : { code: code, expiry: expiryTimeStamp} })
    }else{
        await verificationCodes.insertOne({email: user.email, expiry: expiryTimeStamp, code: code})
    }

    let mailOptions = {
        from: ZOHO_USER,
        to: user.email,
        subject: `ASKDAMARIS.COM VERIFICATION CODE`,
        text: `your verification code is ${code}. It will expire in 30 minutes`,
        html: writeEmail("Verify your email address", "a verification code for your askdamaris.com account", "You have successfully created an account with askdamaris.com . Use the verification code to verify your account. Please note that this code expires after 30 minutes. If you did not request for this, safely ignore this email", code)
    }

    const verifyTransporter = await new Promise((resolve) => {
        transporter.verify(function (info) {
            resolve(info)
        })
    })

    if(!verifyTransporter){
        return new Response(JSON.stringify(new Reply(false, ['an error occured on the server. please try again later'])),{ status: 200})
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve(info)
            }
        })
    })
    
    reply = new Reply(true, ["Your account has been successfully created. We have sent you a verification email."])
    return new Response(JSON.stringify(reply),{status: 200})

}
