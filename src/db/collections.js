import db from "$db/mongo"

const albums = db.collection("Albums")
const messages = db.collection("Messages")
const users = db.collection("Users")
const sessions = db.collection("Sessions")
const mpesa =  db.collection("Mpesa")
const mpesaSTK =  db.collection("MpesaSTK")
const verificationCodes = db.collection("Verification_Codes")

export {
    albums,
    messages,
    users,
    sessions,
    mpesa,
    mpesaSTK,
    verificationCodes
}