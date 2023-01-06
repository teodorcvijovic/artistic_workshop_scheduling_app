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
        // TO DO
    }

    updateCommentContent = async (request: any, response: express.Response) => {
        // TO DO
    }

    deleteComment = async (request: any, response: express.Response) => {
        // TO DO
    }

}