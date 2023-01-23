import { sessions }from '$db/collections'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const sessionId = cookies.get('askdamaris_sess');

    return {
        user: await sessions.findOne({ sessionId: sessionId })
    }
}