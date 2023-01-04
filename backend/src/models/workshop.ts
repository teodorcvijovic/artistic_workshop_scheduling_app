import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Workshop = new Schema(
    {
        id: {type: Number },
        organizer_username: {type: String},

        // main_image
        // gallery

        approved: {type: Boolean},
        
        name: {type: String},
        date: {type: Date},
        address: {type: String},
        short_description: {type: String},
        long_secription: {type: String},
        capacity: {type: Number}, 

        participants: {type: Array},
        reservations: {type: Array},
        waiting_queue: {type: Array},

        likes: {type: Array},
        comments: {type: Array}
    }
)
    
export default mongoose.model('Workshop', Workshop, 'workshop');