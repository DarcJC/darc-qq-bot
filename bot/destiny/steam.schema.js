
const mongoose = require('mongoose');

const {Schema} = mongoose


const steambindingSchema = new Schema({
    uid: String,
    steamid: String,
})

steambindingSchema.set('timestamps', true)


const SteamBinding = mongoose.model('steam_binding', steambindingSchema)


exports.steambindingSchema = steambindingSchema
exports.SteamBinding = SteamBinding
