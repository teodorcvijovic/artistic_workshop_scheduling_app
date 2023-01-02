import express from 'express'
import { UserController } from '../controllers/user.controller'

const user_router = express.Router()

user_router.route("/all").get(
    (request, response) => new UserController().getAllUsers(request, response)
)

export default user_router