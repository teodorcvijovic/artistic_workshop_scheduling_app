import express from "express"
import Workshop from '../models/workshop'
import nodemailer from "nodemailer"
import { Configuration } from "../config"
import User from "../models/user"
import Comment from "../models/comment"
import ChatThread from "../models/chatThread"

import user from "../models/user"
import { Authentication } from "../authentication"
import multer from 'multer'
import { request } from "http"

import fs from 'fs'

export class WorkshopController {

    /****** helper *******/

    async addUsersForAllWorkshops(workshops) {
        let w = []
        for(let i = 0; i < workshops.length; i++) {
            let workshop = await this.returnWorkshopWithUsers(workshops[i])
            w.push(workshop)
        }
        return w
    }

    async returnWorkshopWithUsers(workshop) {
        let w = {
            _id: workshop._id,
            organizer: null,
            images: workshop.images,
            approved: workshop.approved,
            name: workshop.name,
            date: workshop.date,
            address: workshop.address,
            short_description: workshop.short_description,
            long_description: workshop.long_description,
            capacity: workshop.capacity,

            participants: [],
            reservations: [],
            waiting_queue: [],
            likes: []
        }

        w.organizer = await User.findOne({_id: workshop.organizer_id})
        for(let i = 0; i < workshop.participants.length; i++) {
            let user = await User.findOne({_id: workshop.participants[i]._id})
            w.participants.push(user)
        }
        for(let i = 0; i < workshop.reservations.length; i++) {
            let user = await User.findOne({_id: workshop.reservations[i]._id})
            w.reservations.push(user)
        }
        for(let i = 0; i < workshop.waiting_queue.length; i++) {
            let user = await User.findOne({_id: workshop.waiting_queue[i]._id})
            w.waiting_queue.push(user)
        }
        for(let i = 0; i < workshop.likes.length; i++) {
            let user = await User.findOne({_id: workshop.likes[i]._id})
            w.likes.push(user)
        }

        return w
    }

    /*********************/

    getAllActiveWorkshops = async (request: any, response: express.Response)=>{
        let currentDate = new Date()
        let user_id = request.user_id
    
        Workshop.find({approved: true}, async (error , workshops)=>{
            if (error) {
                return response.status(400).send({ message: error })
            }

            workshops = workshops.filter(w => currentDate <= w.date)

            if (user_id) {
                workshops = workshops.filter(w => {
                    let alreadyApplied = false
                    w.participants.forEach(p => {
                        if (p._id == user_id) alreadyApplied = true
                    })
                    w.reservations.forEach(p => {
                        if (p._id == user_id) alreadyApplied = true
                    })

                    return !alreadyApplied && w.organizer_id != user_id
                })
            }

            response.send(await this.addUsersForAllWorkshops(workshops))
        })
    }

    getTop5Workshops = async (request: any, response: express.Response)=>{
        let currentDate = new Date()
    
        Workshop.find({}, async (error , workshops)=>{
            if (error) {
                return response.status(400).send({ message: error })
            }

            workshops.sort((w1, w2) => {
                let l1 = w1.likes == null ? 0 : w1.likes.length
                let l2 = w1.likes == null ? 0 : w2.likes.length
                return l2 - l1
            })

            let w = []

            for(let i = 0; i < 5; ++i) {
                if (i >= workshops.length) break
                w.push(workshops[i])
            }

            response.send(await this.addUsersForAllWorkshops(w))
        })
    }

    getMyPreviousWorkshops = async (request: any, response: express.Response)=>{
        let user_id = request.user_id
        let currentDate = new Date()

        Workshop.find({}, async (error , workshops)=>{
            if (error) {
                return response.status(400).send({ message: error })
            }

            workshops = workshops.filter(w => {
                if (currentDate < w.date ) return false

                let iParticipated = false
                w.participants.forEach(participant => {
                    if (participant._id == user_id) iParticipated = true
                });
                
                return iParticipated
            })
            response.json(await this.addUsersForAllWorkshops(workshops))
        })
    }

    getMyCurrentWorkshops = async (request: any, response: express.Response)=>{
        let currentDate = new Date()
        let user_id = request.user_id

        Workshop.find({}, async (error , workshops)=>{
            if (error) {
                return response.status(400).send({ message: error })
            }

            workshops = workshops.filter(w => {
                if (currentDate >= w.date ) return false

                let iParticipated = false
                w.participants.forEach(participant => {
                    if (participant._id == user_id) iParticipated = true
                });
                w.reservations.forEach(participant => {
                    if (participant._id == user_id) iParticipated = true
                });

                return iParticipated
            })
            response.json(await this.addUsersForAllWorkshops(workshops))
        })
    }

    cancelParticipation = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body._id

        Workshop.findOne({_id: workshop_id}, (error , workshop)=>{
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({ message: 'Workshop not found.' })

            let isRemoved = false
            workshop.participants = workshop.participants.filter(p => {
                if (p._id != user_id) return true
                isRemoved = true
                return false
            })
            if (isRemoved) {
                this.notifyWaitingQueue(workshop)
            }

            isRemoved = false
            workshop.reservations = workshop.reservations.filter(p => {
                if (p._id != user_id) return true
                isRemoved = true
                return false
            })
            if (isRemoved) {
                this.notifyWaitingQueue(workshop)
            }

            isRemoved = false
            workshop.waiting_queue = workshop.waiting_queue.filter(p => {
                if (p._id != user_id) return true
                isRemoved = true
                return false
            })
            workshop.waiting_queue = []

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

        Workshop.find({}, async (error , workshops)=>{
            if (error) {
                return response.status(400).send({ message: error })
            }

            workshops = workshops.filter(w => {
                if (w.organizer_id == user_id) return true
                return false
            })
            response.json(await this.addUsersForAllWorkshops(workshops))
        })
    }

    cancelWorkshopIOrganized = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body._id

        Workshop.findOne({_id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({ message: "Workshop not found." })

            if (workshop.organizer_id != user_id) return response.status(401).send({ message: "Unauthorized attempt to delete a workshop." })
       
            this.notifyAboutWorkshopCanceling(workshop)

            workshop.delete()

            let comments = await Comment.find({workshop_id: workshop_id})
            if (comments == null) comments = []
            for(let i = 0; i < comments.length; i++) {
                comments[i].delete()
            }

            comments = await ChatThread.find({workshop_id: workshop_id})
            if (comments == null) comments = []
            for(let i = 0; i < comments.length; i++) {
                comments[i].delete()
            }

            return response.send({ message: "Workshop successfully canceled" })
        })
    }

    /***** helper *****/

    notifyAboutWorkshopCanceling(workshop) {
        workshop.participants.forEach(async waiting => {
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
                    subject: 'Workshoped canceled!',
                    text: 'Workshop ' + workshop.name + ' is canceled! Sorry.'
                }
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) console.log(error);
                })
            }
        })
    }

    /**************** */

    newWorkshopCreationRequest = async (request: any, response: express.Response)=>{
        let organizer_id = request.user_id
        let images = request.files
        let approved = false
        let name = request.body.name
        let date = request.body.date
        let address = request.body.address
        let short_description = request.body.short_description
        let long_secription = request.body.long_description
        let capacity = request.body.capacity

        User.findOne({_id: organizer_id}, async (error, user) => {
            if (error)  return response.status(400).send({ message: error })

            if (user == null)  return response.status(404).send({ message: "User does not exist." })
        
            let workshop = new Workshop(
                {
                    organizer_id: user._id,
                    images: images,
                    approved: approved,
                    name: name,
                    date: date,
                    address: address,
                    short_description: short_description,
                    long_secription: long_secription,
                    capacity: capacity,
                    participants: [],
                    reservations: [],
                    waiting_queue: [],
                    likes: []
                }
            )

            await workshop.save()
            response.send(workshop)
        })
    }

    /************ participation requests *******/

    applyForWorkshop = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body._id

        Workshop.findOne({_id: workshop_id}, (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({ message: "Workshop not found." })

            if (this.checkIfUserAlreadyApplied(workshop, user_id)) return response.status(404).send({ message: "You cannot apply twice for the same workshop." })

            if (WorkshopController.placesLeft(workshop) <= 0) {
                // capacity full
                workshop.waiting_queue.push({"_id": user_id})
                workshop.save()
                return response.status(400).send({ message: "You will be notified if someone cancel." })
            }

            workshop.reservations.push({"_id": user_id})
            workshop.save()

            return response.send({ message: "Your application request will be considered by organizer." })
        })
    }

    /**** helper ****/

    checkIfUserAlreadyApplied(workshop, user_id) {
        let alreadyApplied = false
        workshop.participants.forEach(participant => {
            if (participant._id == user_id) alreadyApplied = true
        })
        workshop.reservations.forEach(participant => {
            if (participant._id == user_id) alreadyApplied = true
        })

        return alreadyApplied
    }

    static placesLeft(workshop) {
        let cnt = 0
        let participants = workshop.participants
        if (participants != null && participants !== undefined) cnt += workshop.participants.length
        let reservations = workshop.participants
        if (reservations != null && reservations !== undefined) cnt += workshop.reservations.length
        return workshop.capacity - cnt
    }

    /***************/

    putMeInWaitingQueue = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body._id

        Workshop.findOne({_id: workshop_id}, (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({ message: "Workshop not found." })

            workshop.waiting_queue.push({"_id": user_id})
            workshop.save()

            return response.send({ message: "You will be notified if someone cancel." })
        })
    }

    getParticipationRequests = async (request: any, response: express.Response)=>{
        let user_id = request.user_id
        let workshop_id = request.query.workshop_id

        let participationRequests = []

        Workshop.findOne({organizer_id: user_id, _id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }
            if (workshop == null) return response.status(404).send({ message: "Workshop not found." })

            for (const user of workshop.reservations) {
                let u = await User.findOne({_id: user._id})
                if (u != null) {
                    participationRequests.push({
                        _id: u._id,
                        username: u.username,
                        firstname: u.firstname,
                        lastname: u.lastname,
                        email: u.email,
                        workshop_id: workshop_id
                    })
                }
            }

            return response.send(participationRequests)
        })
    }

    permitParticipation = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body.workshop_id
        let participant_id = request.body.participant_id

        Workshop.findOne({organizer_id: user_id, _id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }
            if (workshop == null) return response.status(404).send({ message: "Workshop not found." })

            for (const user of workshop.reservations) {
                if (user._id == participant_id) {
                    workshop.participants.push({_id: participant_id})
                    workshop.reservations = workshop.reservations.filter(u => u._id != participant_id)
                    break
                }
            }

            workshop.save()
            return response.send({message: 'Participation is sucessfully permited.'})
        })
    }

    denyParticipation = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let workshop_id = request.body.workshop_id
        let participant_id = request.body.participant_id

        Workshop.findOne({organizer_id: user_id, _id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }
            if (workshop == null) return response.status(404).send({ message: "Workshop not found." })

            for (const user of workshop.reservations) {
                if (user._id == participant_id) {
                    workshop.reservations = workshop.reservations.filter(u => u._id != participant_id)
                    this.notifyWaitingQueue(workshop)
                    break
                }
            }

            workshop.save()
            return response.send({message: 'Participation is denied.'})
        })
    }
    
    /************* admin routes ****************/

    getAllWorkshops = async (request: express.Request, response: express.Response)=>{
        Workshop.find({}, async (error , workshops)=>{
            if (error) {
                console.log(error)
                return
            }
            response.json(await this.addUsersForAllWorkshops(workshops))
        })
    }

    getAllRequestsForOrganizing = async (request: express.Request, response: express.Response)=>{
        Workshop.find({approved: false}, async (error , workshops)=>{
            if (error) {
                console.log(error)
                return
            }
            response.json(await this.addUsersForAllWorkshops(workshops))
        })
    }

    permitNewWorkshop = (request: express.Request, response: express.Response)=>{
        let workshop_id = request.body.workshop_id

        Workshop.findOne({_id: workshop_id}, async (error, workshop) => {
            if (error) return response.status(400).send({ message: error })

            if (workshop == null) return response.status(404).send({ message: "Workshop is not found." })
        
            // check if user is organizer

            let organizer = await User.findOne({_id: workshop.organizer_id})

            if (organizer.role == Authentication.PARTICIPANT_ROLE) {
                // user cannot participate in any workshop
                let isParticipant = false

                let workshops = await Workshop.find({})
                let currentDate = new Date()
                workshops = workshops.filter(w => currentDate <= w.date)
                workshops.forEach(w => {
                    w.participants.forEach(u => {
                        if (organizer._id == u._id) isParticipant = true
                    })
                    w.reservations.forEach(u => {
                        if (organizer._id == u._id) isParticipant = true
                    })
                })

                if (isParticipant) return response.status(400).send({message: "User is not organizer. User is participating in other workshops."})
            
                organizer.role = Authentication.ORGANIZER_ROLE
                organizer.save()
            }

            workshop.approved = true
            workshop.save()

            return response.send({message: "Workshop is successfully approved."})
        })
    }

    // denyNewWorkshop = async (request: express.Request, response: express.Response)=>{
    //     // TO DO
    // }

    createWorkshop = async (request: any, response: express.Response)=>{
        let organizer_username = request.body.organizer_username
        let images = request.files
        let approved = true
        let name = request.body.name
        let date = request.body.date
        let address = request.body.address
        let short_description = request.body.short_description
        let long_description = request.body.long_description
        let capacity = request.body.capacity

        User.findOne({username: organizer_username}, async (error, user) => {
            if (error)  return response.status(400).send({ message: error })

            if (user == null)  return response.status(404).send({ message: "Organizer does not exist." })
        
            let workshop = new Workshop(
                {
                    organizer_id: user._id,
                    images: images,
                    approved: approved,
                    name: name,
                    date: date,
                    address: address,
                    short_description: short_description,
                    long_description: long_description,
                    capacity: capacity,
                    participants: [],
                    reservations: [],
                    waiting_queue: [],
                    likes: []
                }
            )

            await workshop.save()
            response.send(workshop)
        })    
    }

    updateWorkshop = async (request: any, response: express.Response)=>{
        let role = request.role
        let user_id = request.user_id
        
        let workshop_id = request.body._id
        let organizer_username = request.body.organizer_username
        let images = request.files
        
        let approved = true
        let name = request.body.name
        let date = request.body.date
        let address = request.body.address
        let short_description = request.body.short_description
        let long_description = request.body.long_description
        let capacity = request.body.capacity
        
        let updateImages = request.body.updateImages

        let workshop = await Workshop.findOne({_id: workshop_id})

        if (role != Authentication.ADMIN_ROLE) {
            if (user_id != workshop.organizer_id) {
                return response.status(401).send({message: "Unauthorized workshop update request."})
            }
        }

        if (role == Authentication.ADMIN_ROLE) {
            // organizer change
            let new_organizer = await User.findOne({username: organizer_username})
            if (new_organizer == null)  return response.status(404).send({message: "User is not found."})
            workshop.organizer_id = new_organizer._id
        }
        // if (updateImages || workshop.images.length > 0) workshop.images = images
        if (updateImages == 'true') {
           
            workshop.images = images
        }

        workshop.approved = approved
        workshop.name = name
        workshop.date = date
        workshop.address = address
        workshop.short_description = short_description
        workshop.long_description = long_description
        workshop.capacity = capacity

        await workshop.save()
        return response.send(workshop)
    }

    deleteWorkshop = async (request: express.Request, response: express.Response)=>{
        let workshop_id = request.body.workshop_id

        Workshop.findOne({_id: workshop_id}, async (error, workshop) => {
            if (error) return response.status(400).send({ message: error })

            if (workshop == null) return response.status(404).send({ message: "Workshop is not found." })
        
            workshop.delete()

            let comments = await Comment.find({workshop_id: workshop_id})
            if (comments == null) comments = []
            for(let i = 0; i < comments.length; i++) {
                comments[i].delete()
            }

            comments = await ChatThread.find({workshop_id: workshop_id})
            if (comments == null) comments = []
            for(let i = 0; i < comments.length; i++) {
                comments[i].delete()
            }

            return response.send({message: "Workshop is successfully deleted."})
        })
    }

    saveTemplate = async (request: any, response: express.Response)=>{
        let organizer_id = request.user_id
        
        let workshop_id = request.body.workshop_id
        
        let folderName = "workshop-templates/" + organizer_id

        if (!fs.existsSync(folderName)) {
            fs.mkdir(folderName, { recursive: true }, (err) => {

                Workshop.findOne({_id: workshop_id}, (err, workshop) => {
                    let jsonString = JSON.stringify(workshop)
                    fs.writeFile(folderName + "/" + workshop_id + ".json", jsonString, (err) => {
                        
                    });
        
                    return response.send({"message": "ok"});
                })
            })
        } else {
            Workshop.findOne({_id: workshop_id}, (err, workshop) => {
                let w2 = workshop
                let jsonString = JSON.stringify(w2)
                fs.writeFile(folderName + "/" + workshop_id + ".json", jsonString, (err) => {
                    
                });
    
                return response.send({"message": "ok"});
            })
        }
    }
}