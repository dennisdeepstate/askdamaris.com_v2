import { mpesaSTK, users } from "$db/collections"
import { SAF_PASSCODE, SAF_SHORTCODE, SAF_STK_QUERY_ENDPOINT } from "$env/static/private"
import { getAccessToken } from "$lib/js/getSafAccessToken"

/** @type {import('./../$types').RequestHandler} */
export async function POST({ request }) {

    const checkoutRequestID = (await request.json()).checkoutRequestID
    
    /**
     * @param {string} accessToken
     * @param {string} checkoutRequestID
     */
    async function confirmMpesa(accessToken, checkoutRequestID){
        const timestamp = new Date().toISOString().substring(0, 19).replace(/-|T|:/g, '')
        const password = Buffer.from(`${SAF_SHORTCODE}${SAF_PASSCODE}${timestamp}`).toString('base64')

        const requestBody = {
            BusinessShortCode: SAF_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestID
        }

        const confrimationResponse = await fetch(SAF_STK_QUERY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestBody)
        })

        return await confrimationResponse.json()

    }
    const albumPurchase = await mpesaSTK.findOne({ checkoutRequestID: checkoutRequestID })
    if(!albumPurchase) return new Response(JSON.stringify("payment not found, please try again"),{status: 403})
    const accessToken = await getAccessToken()
    if(!accessToken) return new Response(JSON.stringify("payment not found, please try again"),{status: 403})
    const confirmation = await confirmMpesa(accessToken, checkoutRequestID)
    if(confirmation.ResultCode !== "0") return new Response(JSON.stringify("payment failed"),{status: 403})
    await users.updateOne({email: albumPurchase.email}, { $push: { albums: { name: albumPurchase.album } } })
    return new Response(JSON.stringify('ok'),{status: 200})
}