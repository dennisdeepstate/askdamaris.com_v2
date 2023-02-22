import { users } from '$db/collections'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  const findUser =  await users.findOne({email: locals.user.email})
  let user = {email: undefined, firstName: undefined, lastName: undefined}
  if(findUser){
    user = {
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName
    }
  }
  return {
    user: user
  }
}