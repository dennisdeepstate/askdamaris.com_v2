import { PUBLIC_HOST } from "$env/static/public"

export async function load(){
    const albumsData = await fetch(`${PUBLIC_HOST}/videos/albums`, {
        method: 'GET'
    })
    const albums = await albumsData.json()
    return{
        albums
    }
}