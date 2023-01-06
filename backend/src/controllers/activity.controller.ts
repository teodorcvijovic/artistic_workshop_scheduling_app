import express from "express"
import Workshop from '../models/workshop'
import Comment from "../models/comment"
import nodemailer from "nodemailer"
import { Configuration } from "../config"
import User from "../models/user"
import user from "../models/user"
import { Authentication } from "../authentication"
import { request } from "http"
import comment from "../models/comment"
import ChatThread from "../models/chatThread"


export class ActivityController {

    likeWorkshop = async (request: any, response: express.Response) => {
        let user_id = request.user_id

        let workshop_id = request.body.workshop_id

        Workshop.findOne({_id: workshop_id}, (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({ message: "Workshop is not found" })

            let isLiked = false
            workshop.likes.forEach(u => {
                if (u._id == user_id) isLiked = true
            })
            if (!isLiked) {
                workshop.likes.push({_id: user_id})
            }

            workshop.save()

            return response.send({message: "Workshop is liked."})
        })
    }

    unlikeWorkshop = async (request: any, response: express.Response) => {
        let user_id = request.user_id

        let workshop_id = request.body.workshop_id

        Workshop.findOne({_id: workshop_id}, (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({ message: "Workshop is not found" })

            workshop.likes = workshop.likes.filter(u => u._id != user_id)
            workshop.save()

            return response.send({message: "Workshop is unliked."})
        })
    }

    getMyLikes = async (request: any, response: express.Response) => {
        let user_id = request.user_id
        let workshopsILiked = []

        Workshop.find({}, (error, workshops) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            workshops.forEach(w => {
                w.likes.forEach(like => {
                    if (like._id == user_id) workshopsILiked.push(w)
                })
            })

            response.send(workshopsILiked)
        })
    }

    getMyComments = async (request: any, response: express.Response) => {
        let user_id = request.user_id
        let myComments = []

        Comment.find({user_id: user_id}, async (error, comments) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (comments == null) return response.send({})

            for (let i = 0; i < comments.length; i++) {
                let workshop = await Workshop.findOne({_id: comments[i].workshop_id})
                myComments.push({
                    comment: comments[i],
                    workshop: workshop
                })
            }

            return response.send(myComments)
        })
    }

    getWorkshopLikes = async (request: any, response: express.Response) => {
        let workshop_id = request.body.workshop_id
        let likes = []

        Workshop.findOne({_id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({message: "Workshop not found."})
        
            for (let i = 0; i < workshop.likes.length; i++) {
                let user = await User.findOne({_id: workshop.likes[i]._id})
                if (user == null) continue
                likes.push(user)
            }

            response.send(likes)
        })
    }

    getWorkshopComments = async (request: any, response: express.Response) => {
        let workshop_id = request.body.workshop_id
        let comments = []

        Workshop.findOne({_id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({message: "Workshop not found."})
        
            let comments_without_users = await Comment.find({workshop_id: workshop_id})

            for (let i = 0; i < comments_without_users.length; i++) {
                let user = await User.findOne({_id: comments_without_users[i].user_id})
                if (user == null) continue
                comments.push({
                    comment: comments_without_users[i],
                    user: user
                })
            }

            response.send(comments)
        })
    }

    createComment = async (request: any, response: express.Response) => {
        let user_id = request.user_id

        let workshop_id = request.body.workshop_id
        let content = request.body.content

        let workshop = await Workshop.findOne({_id: workshop_id})
        if (workshop == null) return response.status(404).send({message: "Workshop not found."})

        let comment = new Comment(
            {
                user_id: user_id,
                workshop_id: workshop_id,
                content: content
            }
        )
        await comment.save()
        return response.send(comment)
    }

    updateCommentContent = async (request: any, response: express.Response) => {
        let user_id = request.user_id
        let role = request.role

        let comment_id = request.body.comment_id
        let new_content = request.body.new_content

        Comment.findOne({_id: comment_id}, (error, comment) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (comment == null) {
                return response.status(404).send({ message: "Comment not found." })
            }

            if (role != Authentication.ADMIN_ROLE && user_id != comment.user_id) {
                return response.status(401).send({ message: "Unauthorized attemt to delete a comment." })
            }

            comment.content = new_content
            comment.save()

            return response.send({message: "Comment is updated."})
        })
    }

    deleteComment = async (request: any, response: express.Response) => {
        let user_id = request.user_id
        let role = request.role

        let comment_id = request.body.comment_id

        Comment.findOne({_id: comment_id}, (error, comment) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (comment == null) {
                return response.status(404).send({ message: "Comment not found." })
            }
 
            if (role != Authentication.ADMIN_ROLE && user_id != comment.user_id) {
                return response.status(401).send({ message: "Unauthorized attemt to delete a comment." })
            }

            comment.delete()

            return response.send({message: "Comment is deleted."})
        })
    }

    /************************* chat ***************************/

    getAllThreadOfWorkshopsIParticipateIn = (request: any, response: express.Response) => {
        // TO DO
    }

    getThreadsForWorkshop = (request: any, response: express.Response) => {
        // TO DO
    }

    sendMessage = async (request: any, response: express.Response) => {
        let sender_id = request.user_id

        let thread_id = request.body.thread_id
        let content = request.body.content

        let timestamp = new Date()

        let thread = await ChatThread.findOne({_id: thread_id})
        if (thread == null) return response.status(404).send({message: "Chat thread is not found."})
    
        if (thread.participant_id != sender_id && thread.organizer_id != sender_id) {
            return response.status(401).send({message: "Unauthorized message send."})
        }

        thread.messages.push(
            {
                sender_id: sender_id,
                timestamp: timestamp,
                content: content
            }
        )
        thread.save()

        return response.send({message: "Message is delivered."})
    }

    createChatThread = (request: any, response: express.Response) => {
        let participant_id = request.user_id

        let workshop_id = request.body.workshop_id

        Workshop.findOne({_id: workshop_id}, async (error, workshop) => {
            if (error) {
                return response.status(400).send({ message: error })
            }

            if (workshop == null) return response.status(404).send({message: "Workshop is not found."})

            let thread = await ChatThread.findOne({workshop_id: workshop_id, participant_id: participant_id})
            if (thread != null) return response.status(400).send({message: "Chat thread for this workshop already exists."})

            console.log(workshop.organizer_id)

            thread = new ChatThread(
                {
                    workshop_id: workshop_id,
                    organizer_id: workshop.organizer_id,
                    participant_id: participant_id,
                    messages: []
                }
            )

            await thread.save()

            return response.send(thread)
        })
    }

}