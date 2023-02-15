import { messages } from "$db/collections"
import { ZOHO_USER } from "$env/static/private"
import { validateInput } from "$lib/js/validateInput"
import { transporter } from "$mail/nodemailer"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    let mssg = await request.json()
    mssg.forEach((/** @type {{ title: string; selection: string; }} */ obj) => {
        if(!validateInput(obj.title, obj.selection)) return new Response(JSON.stringify('fail'),{status: 403})
    })

    let saveMessage = await messages.insertOne({mssg})
    let name = mssg.find((/** @type {{ selection: string; }} */ obj) => obj.selection === "name")
    let intro = mssg.find((/** @type {{ selection: string; }} */ obj) => obj.selection === "intro")
    let email = mssg.find((/** @type {{ selection: string; }} */ obj) => obj.selection === "email")
    let phone = mssg.find((/** @type {{ selection: string; }} */ obj) => obj.selection === "phone")
    /**
     * @type {string}
     */
    let mssgRows = ''
    mssg.forEach((/** @type {{ title: string; selection: string; }} */ obj) => {
        mssgRows += `
            <tr>
            <td style="border: 1px solid black; padding: 5px;">${obj.title}</td>
            <td style="border: 1px solid black; padding: 5px;">${obj.selection}</td>
            </tr>
        `
    })
    let html = `
        <h3>${name} (${phone})</h3>
        <p>${intro}</p>
        <table style="border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid black; padding: 5px;">Query</th>
                <th style="border: 1px solid black; padding: 5px;">Response</th>
            </tr>
            ${mssgRows}
        </table>
    `
    let mailOptions = {
        from: ZOHO_USER,
        to: "info@askdamaris.com",
        subject: `askdamaris.com contact form [name: ${name}] [service: ${intro}]`,
        replyTo: email,
        html: html,
    }

    transporter.sendMail(mailOptions, (error)=>{
        if(error) {
            console.log(error)
        }
    })

    return new Response(JSON.stringify(saveMessage ? 'ok' : 'fail'),{status: 200})

}

