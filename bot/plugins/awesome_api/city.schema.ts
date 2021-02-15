
import mongoose, {Document} from 'mongoose';

const {Schema} = mongoose


export interface ICitySchema extends Document {
    uid: String
    city: String
}


export const citySchema = new Schema({
    uid: {unique: true, type: String},
    city: String,
})

citySchema.set('timestamps', true)


export const City = mongoose.model<ICitySchema>('city', citySchema)

export async function getCityById(uid: String): Promise<String> {
    const doc = await City.findOne({
        uid,
    })
    return doc ? doc['city'] : null
}

