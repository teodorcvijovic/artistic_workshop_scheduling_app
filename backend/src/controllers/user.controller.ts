import express from "express"
import User from "../models/user"

import { Configuration } from "../config" 
import jwt from "jsonwebtoken"
import { Authentication } from "../authentication"
import nodemailer from "nodemailer"
import PasswordResetToken from "../models/passwordResetToken"
import crypto from "crypto"
import { ObjectId } from "mongodb"

export class UserController {

    WAITING_STATUS = 0
    APPROVED_STATUS = 1
    DISAPPROVED_STATUS = 2

    getMyProfile = async (request: any, response: express.Response)=>{
        let user_id = request.user_id

        let user = await User.findOne({_id: user_id})
        if (user == null) return response.status(404).send({message: "User is not found."})

        response.send(user)
    }

    register = async (request: express.Request, response: express.Response)=>{
        let username = request.body.username
        let password = request.body.password
        let firstname = request.body.firstname
        let lastname = request.body.lastname
        let phone = request.body.phone
        let email = request.body.email
        let role = request.body.role
        let organization_name = request.body.organization_name
        let organization_address = request.body.organization_address
        let organization_pib = request.body.organization_pib
        let image = request.body.image

        // user cannot register as admin
        if (role == Authentication.ADMIN_ROLE) 
            return response.status(400).send({ message: 'User cannot register as admin.' })

        let u = await User.findOne({'email': email})
        if (u) return response.status(400).send({ message: 'User with given email already exists.' })

        User.findOne({'username': username}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user != null) return response.status(400).send({ message: 'User with given username already exists.' })

            const newUser = new User({
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                role: role,
                organization_name: organization_name,
                organization_address: organization_address,
                organization_pib: organization_pib,
                status: this.WAITING_STATUS,
                image: image
            })

            newUser.save((error, user) => {
                console.log(error)
                if (error) return response.status(400).send({ message: 'Registration failed.' })

                // successful registration
                response.json(user)
            })
        })
    }

    login = (request: express.Request, response: express.Response)=>{
        let username = request.body.username
        let password = request.body.password

        User.findOne({'username': username}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user == null) return response.status(404).send({ message: 'User is not found.' })

            if (user.status == this.WAITING_STATUS) 
                return response.status(401).send({ message: 'Unauthorized access. Registration request is not processed yet.' })

            if (user.status == this.DISAPPROVED_STATUS)
                return response.status(401).send({ message: 'Unauthorized access. Registration request denied.' })

            if (user.password != password) return response.status(401).send({ message: 'Invalid password.' })


            let token_data = {
                '_id': user._id,
                'username': user.username,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'role': user.role,
                'phone': user.phone,
                'email': user.email,
                'organization_name': user.organization_name,
                'organization_address': user.organization_address,
                'organization_pib': user.organization_pib,
            }
            let jwt_token = jwt.sign(token_data, Configuration.JWT_SECRET_KEY)
            response.send({
                'user': JSON.stringify(user),
                'jwt_token': jwt_token
            })
        })
    }

    /**************************** password change *****************************/

    changePassword = (request, response: express.Response)=>{
        let username = request.username // from jwt token

        let old_password = request.body.old_password
        let new_password = request.body.new_password

        User.findOne({'username': username}, (error, user) => {
            if (error) return response.status(400).send({message: error})

            if (user.password != old_password) return response.status(400).send({ message: 'Invalid password.' })

            user.password = new_password
            user.save()

            response.send({message: 'Password is changed.'})
        })
    }

    resetPassword = async (request: express.Request, response: express.Response)=>{
        let email = request.body.email

        let user = await User.findOne({"email": email})
        if (user == null) return response.status(404).send({ message: 'User with email ' + email + ' does not exist.' })

        let token = await PasswordResetToken.findOne({"email": email})
        if (token != null) {
            // remove old request and create a new one
            await token.delete()
        }

        token = new PasswordResetToken({
            email: email,
            key: crypto.randomBytes(20).toString('hex')
        })
        token.save()

        // send the email with the reset link
        // that link should contain the token

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
        
        var link = `http://localhost:4200/reset_link?email=${email}&key=${token.key}` 
        var mailOptions = {
            from: Configuration.APP_EMAIL,
            to: email,
            subject: 'Passoword reset link',
            text: 'Click on this link to reset your password: ' + link
        }
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) console.log(error);
        })

        response.send({message: 'Reset link is sent to ' + email + '.'})
    }

    resetLink = async (request: express.Request, response: express.Response)=>{
        let new_password = request.body.new_password

        let queryParams = request.query
        let email = queryParams.email
        let key = queryParams.key

        const token = await PasswordResetToken.findOne({
            email: email,
            key: key
        })
        if (token == null) {
            // token expired
            return response.status(400).send({message: 'Reset token expired.'})
        }
        await token.delete()

        const user = await User.findOne({email: email})
        user.password = new_password
        user.save()

        response.send({message: 'Password is changed.'})
    }

    /************************* admin controllers ****************************/

    getAllRequests = async (request: express.Request, response: express.Response)=>{
        User.find({status: this.WAITING_STATUS}, (error , users)=>{
            if (error) console.log(error)
            else response.json(users)
        })
    }

    permitRequest = async (request: express.Request, response: express.Response)=>{
        let username = request.body.username

        User.findOne({username: username}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user == null) return response.status(404).send({ message: 'User is not found.' })

            if (user.status != this.WAITING_STATUS) 
                return response.status(400).send({ message: 'Registration request of user ' + username + ' has already been proceed.' })

            user.status = this.APPROVED_STATUS
            user.save()

            response.send({message: 'Request is permited.'})
        })
    }

    denyRequest = async (request: express.Request, response: express.Response)=>{
        let username = request.body.username

        User.findOne({username: username}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user == null) return response.status(404).send({ message: 'User is not found.' })

            if (user.status != this.WAITING_STATUS) 
                return response.status(400).send({ message: 'Registration request of user ' + username + ' has already been proceed.' })

            user.status = this.DISAPPROVED_STATUS
            user.save()

            response.send({message: 'Request is denied.'})
        })
    }

    getAllUsers = (request: express.Request, response: express.Response)=>{
        User.find({}, (error , users)=>{
            if (error) console.log(error)
            else response.json(users)
        })
    }

    deleteUser = (request: express.Request, response: express.Response) => {
        //let username = request.body.username
        let _id = request.body._id

        User.findOne({_id: _id}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user == null) return response.status(404).send({ message: 'User is not found.' })

            user.delete()

            response.send({message: 'User is deleted.'})
        })
    }

    updateUser = async (request: any, response: express.Response) => {
        let requestor_role = request.role
        let requestor_id = request.user_id

        let _id = request.body._id
        let username = request.body.username
        let password = request.body.password
        let firstname = request.body.firstname
        let lastname = request.body.lastname
        let phone = request.body.phone
        let email = request.body.email
        let role = request.body.role
        let organization_name = request.body.organization_name
        let organization_address = request.body.organization_address
        let organization_pib = request.body.organization_pib
        let image = request.body.image


        let u = await User.findOne({username: username, _id: {$ne: _id}})
        if (u) return response.status(400).send({ message: 'Username is not unique.' })
        u = await User.findOne({email: email, _id: {$ne: _id}})
        if (u) return response.status(400).send({ message: 'Email is not unique.' })

        User.findOne({_id: _id}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user == null) return response.status(404).send({ message: 'User is not found.' })

            if (requestor_role != Authentication.ADMIN_ROLE && requestor_id != user._id) {
                return response.status(401).send({ message: 'Unauthorized request.' })
            }

            user.username = username
            user.password = password
            user.firstname = firstname
            user.lastname = lastname
            user.phone = phone
            user.email = email
            if (requestor_role == Authentication.ADMIN_ROLE) user.role = role
            user.organization_name = organization_name
            user.organization_address = organization_address
            user.organization_pib = organization_pib
            user.image = image

            user.save()
            response.send({message: 'User is updated.'})
        })
    }

    createUser = async (request: express.Request, response: express.Response) => {
        let username = request.body.username
        let password = request.body.password
        let firstname = request.body.firstname
        let lastname = request.body.lastname
        let phone = request.body.phone
        let email = request.body.email
        let role = request.body.role
        let organization_name = request.body.organization_name
        let organization_address = request.body.organization_address
        let organization_pib = request.body.organization_pib
        let image = request.body.image

        let u = await User.findOne({'email': email})
        if (u) return response.status(400).send({ message: 'User with given email already exists.' })

        User.findOne({'username': username}, (error, user) => {
            if (error) return response.status(400).send({ message: error })
            
            if (user != null) return response.status(400).send({ message: 'User with given username already exists.' })

            const newUser = new User({
                //_id: new ObjectId(),
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                role: role,
                organization_name: organization_name,
                organization_address: organization_address,
                organization_pib: organization_pib,
                status: this.APPROVED_STATUS,
                image: image
            })

            newUser.save((error, user) => {
                if (error) return response.status(400).send({ message: 'Registration failed.' })

                // successful user creation
                response.json(user)
            })
        })
    }

    getUserDetails = async (request: any, response: any) => {
        let user_id = request.body.user_id

        let user = await User.findOne({_id: user_id})

        if (user == null) return response.status(404).send({message: "User not found."})
        return response.send(user)
    }

}