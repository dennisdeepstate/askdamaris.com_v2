import { users, verificationCodes } from "$db/collections"
import { ZOHO_USER } from "$env/static/private"
import { writeEmail } from "$lib/js/email"
import { Reply } from "$lib/js/session"
import { transporter } from "$mail/nodemailer"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {

    let user = await request.json()
    let reply = new Reply(false, [])

    const findUser = await users.findOne({email: user.email})
    if(!findUser) return new Response(JSON.stringify(new Reply(false, ['the email you entered is either not valid or is not registered on askdamaris.com'])),{status: 200})

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
        subject: `ASKDAMARIS.COM change password`,
        text: `your verification code is ${code}. It will expire in 30 minutes`,
        html: writeEmail("Change Your Password", "a verification code for changing your password", "use the verification code below to change your password. If you did not request for this, safely ignore this email", code)
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
    
    reply = new Reply(true, [`verification code sent to ${user.email}`])
    return new Response(JSON.stringify(reply),{ status: 200})

}