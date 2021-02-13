
import mongoose from 'mongoose'

const {Schema} = mongoose


const steambindingSchema = new Schema({
    uid: String,
    steamid: String,
})

export const SteamBinding = mongoose.model('steam_binding', steambindingSchema)

