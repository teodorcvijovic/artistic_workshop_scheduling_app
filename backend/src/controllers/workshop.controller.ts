import express from "express"
import Workshop from '../models/workshop'
import nodemailer from "nodemailer"
import { Configuration } from "../config"
import User from "../models/user"

export class WorkshopController {

    getAllActiveWorkshops = async (request: any, response: express.Response)=>{
        let currentDate = new Date()
    
        Workshop.find({}, (error , workshops)=>{
            if (error) {
                console.log(error)
                return
            }

            workshops = workshops.filter(w => currentDate <= w.date)
            response.json(workshops)
        })
    }

    getMyPreviousWorkshops = async (request: any, response: express.Response)=>{
        let user_id = request.user_id
        let currentDate = new Date()

        Workshop.find({}, (error , workshops)=>{
            if (error) {
                console.log(error)
                return
            }

            workshops = workshops.filter(w => {
                if (currentDate < w.date ) return false

                let iParticipated = false
                w.participants.forEach(participant => {
                    if (participant._id == user_id) iParticipated = true
                });
                
                return iParticipated
            })
            response.json(workshops)
        })
    }

    getMyCurrentWorkshops = async (request: any, response: express.Response)=>{
        let currentDate = new Date()
        let user_id = request.user_id

        Workshop.find({}, (error , workshops)=>{
            if (error) {
                console.log(error)
                return
            }

            workshops = workshops.filter(w => {
                if (currentDate >= w.date ) return false

                let iParticipated = false
                w.participants.forEach(participant => {
                    if (participant._id == user_id) iParticipated = true
                });

                return iParticipated
            })
            response.json(workshops)
        })
    }

    cancelParticipation = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body._id

        Workshop.findOne({_id: workshop_id}, (error , workshop)=>{
            if (error) {
                console.log(error)
                return
            }

            if (workshop == null) return response.status(404).send({ message: 'Workshop not found.' })

            let isRemoved = false
            workshop.participants = workshop.participants.filter(p => {
                if (p._id != user_id) return true
                isRemoved = true
                return false
            })
            if (isRemoved) {
                workshop.capacity = workshop.capacity - 1
                this.notifyWaitingQueue(workshop)
            }

            isRemoved = false
            workshop.reservations = workshop.reservations.filter(p => {
                if (p._id != user_id) return true
                isRemoved = true
                return false
            })
            if (isRemoved) {
                workshop.capacity = workshop.capacity - 1
                this.notifyWaitingQueue(workshop)
            }

            isRemoved = false
            workshop.waiting_queue = workshop.waiting_queue.filter(p => {
                if (p._id != user_id) return true
                isRemoved = true
                return false
            })
            workshop.waiting_queue = {}

            workshop.save()

            response.send({message: 'Participation successfully canceled.'})
        })
    }

    /***** helper ******/

    async notifyWaitingQueue(workshop) {
        workshop.waiting_queue.forEach(async waiting => {
            // send an email
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: Configuration.APP_EMAIL,
                    pass: Configuration.APP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            let user = await User.findOne({_id: waiting._id})
            if (user != null) { 
                let email = user.email
                var mailOptions = {
                    from: Configuration.APP_EMAIL,
                    to: email,
                    subject: 'Apply now!',
                    text: 'You can now try to apply to workshop: ' + workshop.name
                }
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) console.log(error);
                })
            }
        })
    }

    /*******************/

    getAllWorkshopsOrganizeByMe = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        Workshop.find({}, (error , workshops)=>{
            if (error) {
                console.log(error)
                return
            }

            workshops = workshops.filter(w => {
                if (w.organizer_id == user_id) return true
                return false
            })
            response.json(workshops)
        })
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