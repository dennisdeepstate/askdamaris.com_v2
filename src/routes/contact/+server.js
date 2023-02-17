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
    if(!saveMessage) return new Response(JSON.stringify('fail'),{status: 200})

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
            <td style="border: 1px solid #a49cb1; padding: 12px;">${obj.title}</td>
            <td style="border: 1px solid #a49cb1; padding: 12px;">${obj.selection}</td>
            </tr>
        `
    })
    let html = `
        <html>
            <h3 style="color: #5a189a;">${name} | phone: ${phone}</h3>
            <p style="color: #1d1d1d;">${intro}</p>
            <table style="border-collapse: collapse; color: #1d1d1d;">
                <tr>
                    <th style="border: 1px solid #a49cb1; padding: 12px; color: #5a189a;">Query</th>
                    <th style="border: 1px solid #a49cb1; padding: 12px; color: #5a189a;">Response</th>
                </tr>
                ${mssgRows}
            </table>
        </html>
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

    return new Response(JSON.stringify('ok'),{status: 200})

}

