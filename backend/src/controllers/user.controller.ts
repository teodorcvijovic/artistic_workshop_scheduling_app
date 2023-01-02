import express from "express"
import User from "../models/user"

export class UserController {

    getAllUsers = (request: express.Request, response: express.Response)=>{
        User.find({}, (error , users)=>{
            if (error) console.log(error)
            else response.json(users)
        })
    }
}