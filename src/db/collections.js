import db from "$db/mongo"

const albums = db.collection("Albums")
const videos = db.collection("Videos")
const messages = db.collection("Messages")
const users = db.collection("Users")
const sessions = db.collection("Sessions")

export {
    albums,
    messages,
    videos,
    users,
    sessions
}