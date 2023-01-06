import express from 'express'
import { ActivityController } from '../controllers/activity.controller'
import { Authentication } from '../authentication'

const activity_router = express.Router()

/********* comments  and likes ***********/

activity_router.route("/like").put(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().likeWorkshop(request, response)
)

activity_router.route("/unlike").put(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().unlikeWorkshop(request, response)
)

activity_router.route("/mylikes").get(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().getMyLikes(request, response)
)

activity_router.route("/mycomments").get(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().getMyComments(request, response)
)

activity_router.route("/workshop_likes").get(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().getWorkshopLikes(request, response)
)
    
activity_router.route("/workshop_comments").get(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().getWorkshopComments(request, response)
)

activity_router.route("/comment").post(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().createComment(request, response)
)

activity_router.route("/comment").put(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().updateCommentContent(request, response)
)

activity_router.route("/comment").delete(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().deleteComment(request, response)
)

/********** chat ************/

// TO DO

export default activity_router