
const mongoose = require('mongoose');

const {Schema} = mongoose


export const steambindingSchema = new Schema({
    uid: String,
    steamid: String,
})

steambindingSchema.set('timestamps', true)


export const SteamBinding = mongoose.model('steam_binding', steambindingSchema)

