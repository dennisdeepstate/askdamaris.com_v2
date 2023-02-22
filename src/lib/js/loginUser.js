import { PUBLIC_HOST } from '$env/static/public'
import { FrontEndUser } from '$lib/js/userStore.js'

/**
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 */
function loginFrontEndUser(email, firstName, lastName) {
    FrontEndUser.set({
        email: email,
        firstName: firstName,
        lastName: lastName
    })
}
async function logoutFrontEndUser(){
    await fetch(`${PUBLIC_HOST}/user/logout`,{ 
        method: 'GET'
    })
    FrontEndUser.set({
        email: undefined,
        firstName: undefined,
        lastName: undefined
    })
}
export {
   loginFrontEndUser,
   logoutFrontEndUser
}