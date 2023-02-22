import { writable } from 'svelte/store'
/**
 * @type {{email: string | undefined; firstName: string | undefined; lastName: string | undefined;}}
 */
let user = {email: undefined, firstName: undefined, lastName: undefined}
export const FrontEndUser = writable(user)