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

activity_router.route("/workshop_likes").post(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().getWorkshopLikes(request, response)
)
    
activity_router.route("/workshop_comments").post(
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

activity_router.route("/thread").post(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().getThread(request, response)
)

activity_router.route("/threads").get(
    [Authentication.jwtCheck, Authentication.isParticipant],
    (request, response) => new ActivityController().getMyThreads(request, response)
)

activity_router.route("/threads_for_workshop").post(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    (request, response) => new ActivityController().getThreadsForWorkshop(request, response)
)

activity_router.route("/message").post(
    [Authentication.jwtCheck],
    (request, response) => new ActivityController().sendMessage(request, response)
)

activity_router.route("/create_thread").post(
    [Authentication.jwtCheck, Authentication.isParticipant],
    (request, response) => new ActivityController().createChatThread(request, response)
)

export default activity_router