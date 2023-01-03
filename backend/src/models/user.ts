import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User = new Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String
        },
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        phone: {
            type: String
        },
        email: {
            type: String
        },
        role: {
            type: Number
        },
        organization_name: {
            type: String
        },
        organization_address: {
            type: String
        },
        organization_pib: {
            type: String
        },
        status: {
            type: Number
        }
    }
)

export default mongoose.model('User', User, 'user');