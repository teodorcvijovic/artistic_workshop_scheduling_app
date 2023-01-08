import express from 'express'
import { WorkshopController } from '../controllers/workshop.controller'
import { Authentication } from '../authentication'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req: any,file: any,cb: any) => {
    if(file.mimetype === "image/jpg"  || 
       file.mimetype ==="image/jpeg"  || 
       file.mimetype ===  "image/png"){
     
        cb(null, true);
    }
    else{
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
    }
}

const upload = multer({storage: storage, fileFilter : fileFilter})

const workshop_router = express.Router()

// not have happened yet
workshop_router.route("/all_active").get(
    // everyone can see it
    (request, response) => new WorkshopController().getAllActiveWorkshops(request, response)
)

workshop_router.route("/participated_in_past").get(
    [Authentication.jwtCheck],
    (request, response) => new WorkshopController().getMyPreviousWorkshops(request, response)
)

workshop_router.route("/participating").get(
    [Authentication.jwtCheck],
    (request, response) => new WorkshopController().getMyCurrentWorkshops(request, response)
)

workshop_router.route("/cancel_pariticipation").put(
    [Authentication.jwtCheck, Authentication.isParticipant],
    (request, response) => new WorkshopController().cancelParticipation(request, response)
)

workshop_router.route("/organized_by_me").get(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    (request, response) => new WorkshopController().getAllWorkshopsOrganizeByMe(request, response)
)

// need to send an email to all participants
workshop_router.route("/cancel").delete(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    (request, response) => new WorkshopController().cancelWorkshopIOrganized(request, response)
)

// new workshop request can be created by both participant and organizer
workshop_router.route("/new_request").post(
    [Authentication.jwtCheck],
    upload.array('images',5),
    (request, response) => new WorkshopController().newWorkshopCreationRequest(request, response)
)

/*************** participation requests **************/

workshop_router.route("/apply").post(
    [Authentication.jwtCheck, Authentication.isParticipant],
    (request, response) => new WorkshopController().applyForWorkshop(request, response)
)

workshop_router.route("/queue").post(
    [Authentication.jwtCheck, Authentication.isParticipant],
    (request, response) => new WorkshopController().putMeInWaitingQueue(request, response)
)

// for individual workshops
// query param: workshop_id
workshop_router.route("/participation_requests").get(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    (request, response) => new WorkshopController().getParticipationRequests(request, response)
)

workshop_router.route("/permit_participation").put(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    (request, response) => new WorkshopController().permitParticipation(request, response)
)

workshop_router.route("/deny_participation").put(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    (request, response) => new WorkshopController().denyParticipation(request, response)
)

/******************* admin routes ********************/

workshop_router.route("/all").get(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new WorkshopController().getAllWorkshops(request, response)
)

// get all requests for organizing a workshop
workshop_router.route("/requests").get(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new WorkshopController().getAllRequestsForOrganizing(request, response)
)

workshop_router.route("/permit").put(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new WorkshopController().permitNewWorkshop(request, response)
)

// workshop_router.route("/deny").put(
//     [Authentication.jwtCheck, Authentication.isAdmin],
//     (request, response) => new WorkshopController().denyNewWorkshop(request, response)
// )

// admin create workshop, organizer must send request for creating a new workshop
workshop_router.route("").post(
    [Authentication.jwtCheck, Authentication.isAdmin],
    upload.array('images',5),
    (request, response) => new WorkshopController().createWorkshop(request, response)
)

// update workshop, note that this is called by both organizer and admin
workshop_router.route("").put(
    [Authentication.jwtCheck, Authentication.isOrganizer],
    upload.array('images',5),
    (request, response) => new WorkshopController().updateWorkshop(request, response)
)

// admin delete workshop, organizer must call cancel
workshop_router.route("").delete(
    [Authentication.jwtCheck, Authentication.isAdmin],
    (request, response) => new WorkshopController().deleteWorkshop(request, response)
)

/******* image retrieving ********/

const fs = require("fs");
const path = require("path");

workshop_router.route("/image").get(
    (request, res) => {
        let serverPath = request.query.path

        var filePath = path.join(__dirname,
            "\\..\\..\\" + serverPath
        ).split("%20").join(" ");
 
    // Checking if the path exists
    fs.exists(filePath, function (exists) {
 
        if (!exists) {
            res.writeHead(404, {
                "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
        }
 
        // Extracting file extension
        var ext = path.extname(serverPath);
 
        // Setting default Content-Type
        var contentType = "text/plain";
 
        // Checking if the extension of
        // image is '.png'
        if (ext === ".png") {
            contentType = "image/png";
        }
 
        // Setting the headers
        res.writeHead(200, {
            "Content-Type": contentType });

        // Reading the file
        fs.readFile(filePath,
            function (err, content) {
                // Serving the image
                res.end(content);
            });
    });
    }
)

export default workshop_router