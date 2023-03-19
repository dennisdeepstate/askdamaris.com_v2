import { SAF_AUTH_ENDPOINT, SAF_CONSUMER_KEY, SAF_CONSUMER_SECRET} from "$env/static/private"

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

    const authResponse = await fetch(SAF_AUTH_ENDPOINT, options)
    const data =  await authResponse.json()
    accessToken = data.access_token
    
    return accessToken
}

export{
    getAccessToken
}
