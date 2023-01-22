import { startMongoDb } from "$db/mongo"

async function connectToMongoDb(){
    await startMongoDb()
    console.log('mongo started')
}

connectToMongoDb()