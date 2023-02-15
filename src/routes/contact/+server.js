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
    let name = mssg.find((/** @type {{ title: string; }} */ obj) => obj.title === "name").selection
    let intro = mssg.find((/** @type {{ title: string; }} */ obj) => obj.title === "intro").selection
    let email = mssg.find((/** @type {{ title: string; }} */ obj) => obj.title === "email").selection
    let phone = mssg.find((/** @type {{ title: string; }} */ obj) => obj.title === "phone").selection
    /**
     * @type {string}
     */
    let mssgRows = ''
    mssg.forEach((/** @type {{ title: string; selection: string; }} */ obj) => {
        mssgRows += `
            <tr>
            <td style="border: 1px solid rgb(164, 156, 177); padding: 8px; color: rgba(90, 24, 154, 1);">${obj.title}</td>
            <td style="border: 1px solid rgb(164, 156, 177); padding: 8px;">${obj.selection}</td>
            </tr>
        `
    })
    let html = `
        <h3 style="color: rgba(90, 24, 154, 1);">${name} | phone: ${phone}</h3>
        <p style="color: rgba(29, 29, 29, 1);">${intro}</p>
        <table style="border-collapse: collapse; color: rgba(29, 29, 29, 1);">
            <tr>
                <th style="border: 1px solid rgb(164, 156, 177); padding: 8px; color: rgba(90, 24, 154, 1);">Query</th>
                <th style="border: 1px solid rgb(164, 156, 177); padding: 8px; color: rgba(90, 24, 154, 1);">Response</th>
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

