import { ZOHO_PASS, ZOHO_USER } from "$env/static/private"
import { createTransport } from "nodemailer"


let transporter = createTransport({
    name: 'smtp.zoho.com',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth:{
        user: ZOHO_USER,
        pass: ZOHO_PASS
    }
})

export { transporter }