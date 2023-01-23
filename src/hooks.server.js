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

    if (sessionId) {
        const userSession = await sessions.findOne({sessionId: sessionId});
        if (userSession && userSession.userAgent === event.request.headers.get('user-agent')) {
            event.locals.user = {
                authenticated: true,
                firstName: userSession.firstName,
                lastName: userSession.lastName,
                email:userSession.email,
                userAgent: userSession.userAgent
            }
        }
    }
  
    if (!event.locals.user) cookies.delete('askdamaris_sess')
    const response = await resolve(event)
  
    return response
}