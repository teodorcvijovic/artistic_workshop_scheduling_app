import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Comment = new Schema(
    {
        id: {type: ObjectId },
        workshop_id: {type: String},
        user_id: {type: String}, 
        timestamp: {type: Date, default: new Date()},
        content: {type: String}
    }
)
    
export default mongoose.model('Comment', Comment, 'comment');