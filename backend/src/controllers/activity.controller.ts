import express from "express"
import Workshop from '../models/workshop'
import nodemailer from "nodemailer"
import { Configuration } from "../config"
import User from "../models/user"
import user from "../models/user"
import { Authentication } from "../authentication"
import { request } from "http"


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
        // TO DO
    }

    getMyComments = async (request: any, response: express.Response) => {
        // TO DO
    }

    getWorkshopLikes = async (request: any, response: express.Response) => {
        // TO DO
    }

    getWorkshopComments = async (request: any, response: express.Response) => {
        // TO DO
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