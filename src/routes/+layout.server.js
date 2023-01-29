import { users } from '$db/collections'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  const findUser =  await users.findOne({email: locals.user.email})
  let user = {
    authenticated: false,
    firstName: null,
    lastName: null
  }
  if(findUser){
    user = {
      authenticated: true,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
    }
  }
  return {
    user: user
  }
}