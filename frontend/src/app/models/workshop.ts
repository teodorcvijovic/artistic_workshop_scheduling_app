import { User } from "./user"
import { Image } from "./image"

export class Workshop{
    _id: string
    organizer: User

    images: Array<Image>

    approved: boolean

    name: string
    date: Date
    address: string
    short_description: string
    long_description: string
    capacity: number

    participants: Array<object>
    reservations: Array<object>
    waiting_queue: Array<object>

    likes: Array<User>
}