
import mongoose, {Document} from 'mongoose';

const {Schema} = mongoose


export interface ISteamBinding extends Document {
    uid: String
    steamid: String
}


export const steambindingSchema = new Schema({
    uid: {unique: true, type: String},
    steamid: String,
})

steambindingSchema.set('timestamps', true)


export const SteamBinding = mongoose.model<ISteamBinding>('steam_binding', steambindingSchema)

