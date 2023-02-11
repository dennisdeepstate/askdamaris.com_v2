import db from "$db/mongo"

const albums = db.collection("Albums")
const messages = db.collection("Messages")
const users = db.collection("Users")
const sessions = db.collection("Sessions")
const mpesa =  db.collection("Mpesa")

export {
    albums,
    messages,
    users,
    sessions,
    mpesa
}