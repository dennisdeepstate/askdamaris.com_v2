import { albums, users } from "$db/collections"
import { NODE_ENV, SAF_AUTH_ENDPOINT, SAF_COMPANY_NAME, SAF_CONSUMER_KEY, SAF_CONSUMER_SECRET, SAF_MY_PASSWORD, SAF_STK_ENDPOINT, SAF_TILL_NUMBER } from "$env/static/private"
import { validateInput } from "$lib/js/validateInput"

async function getAccessToken(){
    let accessToken
    const consumerKey = SAF_CONSUMER_KEY
    const consumerSecret = SAF_CONSUMER_SECRET
    const authCredentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

    const headers = {
        "Authorization": `Basic ${authCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const options = {
        method: "GET",
        headers: headers
    }

    const authUrl = SAF_AUTH_ENDPOINT
    const authResponse = await fetch(authUrl, options)
    const data =  await authResponse.json()
    accessToken = data.access_token
    
    return accessToken
}

/**
 * @param {string} phone
 * @param {number} amount
 * @param {string} callbackUrl
 * @param {string} accessToken
 */
async function stkPush(phone, amount, callbackUrl, accessToken){
    let responseCode
    const tillNumber = SAF_TILL_NUMBER 
    const timestamp = new Date().toISOString().substring(0, 19).replace(/-|T|:/g, '')
    const password = Buffer.from(`${tillNumber}${SAF_MY_PASSWORD}${timestamp}`).toString('base64')

    const requestBody = {
        BusinessShortCode: tillNumber,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: tillNumber,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: SAF_COMPANY_NAME,
        TransactionDesc: "Purchase of ask damaris Videos online",
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
    responseCode = stk.ResponseCode
    console.log(stk)
    return responseCode

}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    let response = {
        success: false,
        mssg: "an error occured on the server"
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
        const responseCode = await stkPush(transaction.phone, NODE_ENV === "Prod" ? album.price : 1, `https://askdamaris.com/buy/rzj8dev9ccxa9453/${encodeURIComponent(locals.user.email)}/${encodeURIComponent(transaction.album)}/${SAF_MY_PASSWORD}`, accessToken)
        response.success = responseCode === "0"
        response.mssg = response.success ? "We have sent an STK push to this number. Enter your pin to complete the purchase" : "An error occured please send us an email on info@askdamaris.com"
    }

    return new Response(JSON.stringify(response),{status: 200})

}