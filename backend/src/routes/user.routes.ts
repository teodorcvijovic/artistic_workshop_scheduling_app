import express from 'express'
import { UserController } from '../controllers/user.controller'
import { Authentication } from '../authentication'

const user_router = express.Router()

user_router.route("/register").post(
    (request, response) => new UserController().register(request, response)
)

user_router.route("/login").post(
    (request, response) => new UserController().login(request, response)
)

user_router.route("/change_password").put(
    [Authentication.jwtCheck],
    (request, response) => new UserController().changePassword(request, response)
)

user_router.route("/reset_password").put(
    (request, response) => new UserController().resetPassword(request, response)
)

user_router.route("/reset_link").post(
    (request, response) => new UserController().resetLink(request, response)
)

// admin routes

user_router.route("/requests").get(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().getAllRequests(request, response)
)

user_router.route("/permit").put(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().permitRequest(request, response)
)

user_router.route("/deny").put(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().denyRequest(request, response)
)

user_router.route("/all").get(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().getAllUsers(request, response)
)

user_router.route("").delete(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().deleteUser(request, response)
)

user_router.route("").put(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().updateUser(request, response)
)

user_router.route("").post(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new UserController().createUser(request, response)
)

export default user_router