import { messages } from "$db/collections"
import { ZOHO_USER } from "$env/static/private"
import { validateInput } from "$lib/js/validateInput"
import { transporter } from "$mail/nodemailer"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    let mssg = await request.json()
    mssg.forEach((/** @type {{ title: string; selection: string; }} */ element) => {
        if(!validateInput(element.title, element.selection)) return new Response(JSON.stringify('fail'),{status: 403})
    })

    let saveMessage = await messages.insertOne({mssg})
    let mailOptions = {
        from: ZOHO_USER,
        to: "dennis@ruracio.com",
        subject: "test",
        text: "test"
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error) {
            console.log(error)}else{
                console.log(info)
            }
    })

    return new Response(JSON.stringify(saveMessage ? 'ok' : 'fail'),{status: 200})

}

