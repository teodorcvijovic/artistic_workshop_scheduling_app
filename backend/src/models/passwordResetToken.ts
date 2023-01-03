import mongoose from 'mongoose';
import { Configuration } from '../config';

const Schema = mongoose.Schema;

let PasswordResetToken = new Schema(
    {
        email: {
            type: String
        },
        key: {
            type: String
        },
        expiration_timestamp: {
            type: Date,
            default: Date.now,
            expires: 60 * Configuration.PASSWORD_RESET_TOKEN_DURATION
        }
    }
)

export default mongoose.model('PasswordResetToken', PasswordResetToken, 'password_reset_token');