import { albums, mpesaSTK, users } from "$db/collections"
import { NODE_ENV, SAF_COMPANY_NAME, SAF_PASSCODE, SAF_STK_ENDPOINT, SAF_SHORTCODE, SAF_TILL_NUMBER } from "$env/static/private"
import { validateInput } from "$lib/js/validateInput"
import { getAccessToken } from "$lib/js/getSafAccessToken"


/**
 * @param {string} phone
 * @param {number} amount
 * @param {string} callbackUrl
 * @param {string} accessToken
 */
async function stkPush(phone, amount, callbackUrl, accessToken){

    const timestamp = new Date().toISOString().substring(0, 19).replace(/-|T|:/g, '')
    const password = Buffer.from(`${SAF_SHORTCODE}${SAF_PASSCODE}${timestamp}`).toString('base64')

    const requestBody = {
        BusinessShortCode: SAF_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: SAF_TILL_NUMBER,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: SAF_COMPANY_NAME,
        TransactionDesc: "Purchase of askdamaris Videos online",
    }
    const stkResponse = await fetch(SAF_STK_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
    })

    const stk = await stkResponse.json()
    return stk
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    let response = {
        success: false,
        mssg: "an error occured on the server",
        payload: undefined
    }
    const transaction = await request.json()
    
    if(!transaction.album || !transaction.phone){
        response.mssg = "please fill out all the fields"
        return new Response(JSON.stringify(response),{status: 403})
    }
    const album = await albums.findOne({name: transaction.album})
    if(!locals.user.email){
        response.mssg = "Please login"
        return new Response(JSON.stringify(response),{status: 403})
    }
    if(!validateInput("phone", transaction.phone)){
        response.mssg = "Please enter a valid phone number"
        return new Response(JSON.stringify(response),{status: 403})
    }
    if(!album){
        response.mssg = "The album you are trying to purchase does not exist"
        return new Response(JSON.stringify(response),{status: 403})
    }
    const userMatchedToPurchase = await users.findOne({email: locals.user.email, "albums.name": transaction.album })

    if(userMatchedToPurchase){
        response.mssg = "You have already purchased this album with this account. Please login with a different account to purchase."
        return new Response(JSON.stringify(response),{status: 403})
    }

    const accessToken = await getAccessToken()

    if(accessToken){
        const stk = await stkPush(transaction.phone, NODE_ENV === "Prod" ? album.price : 1, `https://askdamaris.com/buy/rzj8dev9ccxa9453/${encodeURIComponent(locals.user.email)}/${encodeURIComponent(transaction.album)}/${SAF_PASSCODE}`, accessToken)
        await mpesaSTK.insertOne({email: locals.user.email, amount: album.price, phone: transaction.phone, album: transaction.album, checkoutRequestID: stk.CheckoutRequestID})
        response.success = stk.ResponseCode === "0"
        response.mssg = response.success ? "We have sent an STK push request to the number you provided. Enter your pin on your phone, then click on the confrim payment button below to complete your purchase. Please contact us on +254791235334 for an queries." : "An error occured please send us an email on info@askdamaris.com"
        response.payload = response.success ? stk.CheckoutRequestID : undefined
    }

    return new Response(JSON.stringify(response),{status: 200})

}