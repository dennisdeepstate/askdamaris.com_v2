// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals { user: { authenticated: boolean; firstName: string | null; lastName: string | null; email: string | null;}}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
