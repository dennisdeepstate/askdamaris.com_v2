import { startMongoDb } from "$db/mongo"
import { sessions } from "$db/collections"

async function connectToMongoDb(){
    await startMongoDb()
}

connectToMongoDb()

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }){
    const { cookies } = event
    const sessionId = cookies.get('askdamaris_sess')
    event.locals.user = {
        authenticated: false,
        firstName: null,
        lastName: null,
        email: null
    }
    if (sessionId) {
        const userSession = await sessions.findOne({sessionId: sessionId})
        if (userSession && userSession.userAgent === event.request.headers.get('user-agent') && userSession.expiry >  Math.floor(Date.now() / 1000)) {

            event.locals.user = {
                authenticated: true,
                firstName: userSession.firstName,
                lastName: userSession.lastName,
                email:userSession.email
            }
        }
    }
  
    if (!event.locals.user.authenticated) {
        cookies.set('askdamaris_sess', '', {
            path: '/',
            expires: new Date(0)
        })
    }
    const response = await resolve(event)

    return response
}