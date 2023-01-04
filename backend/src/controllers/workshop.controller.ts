import express from "express"

export class WorkshopController {

    getAllActiveWorkshops = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    getMyPreviousWorkshops = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    getMyCurrentWorkshops = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    cancelParticipation = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    getAllWorkshopsOrganizeByMe = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    cancelWorkshopIOrganized = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    newWorkshopCreationRequest = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    /************ participation requests *******/

    applyForWorkshop = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    putMeInWaitingQueue = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    getAllParticipationRequests = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    permitParticipation = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    denyParticipation = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }
    
    /************* admin routes ****************/

    getAllWorkshops = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    getAllRequestsForOrganizing = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    permitNewWorkshop = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    denyNewWorkshop = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    createWorkshop = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    updateWorkshop = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }

    deleteWorkshop = async (request: express.Request, response: express.Response)=>{
        // TO DO
    }
}