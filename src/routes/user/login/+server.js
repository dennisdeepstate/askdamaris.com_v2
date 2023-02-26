import { users, sessions, verificationCodes } from "$db/collections"
import { hex, sha256} from '$lib/js/sha256'
import { NODE_ENV, ZOHO_USER } from "$env/static/private"
import { Reply, Session } from "$lib/js/session"
import { transporter } from "$mail/nodemailer"
import { writeEmail } from "$lib/js/email"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

    let user = await request.json()
    let reply = new Reply(false, [])
    if(!user.email || !user.password) return new Response(JSON.stringify(new Reply(false, ['Please fill out all the fields.'])),{status: 403})
    const expiryTimeStamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 2)

    user.email = user.email.toLowerCase()
    user.password = await hex(await sha256(user.password))
    
    const findUser = await users.findOne({email: user.email})
    if(!findUser || findUser.password !== user.password) return new Response(JSON.stringify(new Reply(false, ['the email and password combination you entered do not match'])),{status: 403})
    if(!findUser.verified) {
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
            subject: `[askdamaris.com] email verification`,
            text: `your verification code is ${code}. It will expire in 30 minutes`,
            html: writeEmail("Verify your email address", "a verification code for your askdamaris.com account", "You have successfully created an account with askdamaris.com . Use the verification code to verify your account. Please note that this code expires after 30 minutes. If you did not request for this, safely ignore this email", code)
        }

        const verifyTransporter = await new Promise((resolve) => {
            transporter.verify(function (err, info) {
                resolve(info)
            })
        })

        if(!verifyTransporter){
            return new Response(JSON.stringify(new Reply(false, ['an error occured on the server. please try again later'])),{ status: 500})
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
        return new Response(JSON.stringify(new Reply(true, ["you need to verify your account"])),{ status: 200})
    }

    const cookieId = crypto.randomUUID()
    await sessions.insertOne(new Session(cookieId, findUser.email, request.headers.get('user-agent'), expiryTimeStamp))
    cookies.set('askdamaris_sess', cookieId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENV === "Prod",
        maxAge: 60 * 60 * 24 * 2
    })

    reply = new Reply(true, ["ok"], {email: findUser.email, firstName: findUser.firstName, lastName: findUser.lastName})
    return new Response(JSON.stringify(reply),{ status: 200})

}
