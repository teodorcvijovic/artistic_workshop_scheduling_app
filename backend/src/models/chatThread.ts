import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ChatThread = new Schema(
    {
        id: {type: ObjectId },

        workshop_id: {type: String},

        organizer_id: {type: String},
        participant_id: {type: String},
        
        messages: {type: Array}
    }
)
    
export default mongoose.model('ChatThread', ChatThread, 'chat_thread');