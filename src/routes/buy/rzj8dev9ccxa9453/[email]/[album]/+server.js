import { albums, mpesa, users } from "$db/collections"
import { NODE_ENV } from "$env/static/private"

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request }) {

    const mpesaReceived = await request.json()
    const email = params.email
    const albumName = params.album

    if(mpesaReceived.Body.stkCallBack.ResultCode !== "0") return new Response(JSON.stringify('fail'),{status: 200})

    const stkData = mpesaReceived.Body.stkCallBack.CallbackMetadata.Item
    const amountPaid = stkData.find((/** @type {{ Name: string; }} */ obj) => obj.Name === "Amount")
    const transaction = stkData.find((/** @type {{ Name: string; }} */ obj) => obj.Name === "MpesaReceiptNumber")
    const phone = stkData.find((/** @type {{ Name: string; }} */ obj) => obj.Name === "PhoneNumber")
    const date = stkData.find((/** @type {{ Name: string; }} */ obj) => obj.Name === "TransactionDate")

    await mpesa.insertOne({transaction: transaction.value, amount: amountPaid.value, date: date.value, phone: phone.value})

    const album = await albums.findOne({name: albumName})
    if(!album) return new Response(JSON.stringify('fail'),{status: 200})
    const amountDue = NODE_ENV === "Prod" ? 1 : album.price

    if(amountDue !== amountPaid.value) return new Response(JSON.stringify('fail'),{status: 200})

    await users.updateOne({email: email}, { $push: { albums: albumName } })

    return new Response(JSON.stringify('ok'),{status: 200})

}
