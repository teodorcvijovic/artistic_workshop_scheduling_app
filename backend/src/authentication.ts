import jwt from "jsonwebtoken"
import { Configuration } from "./config";

export class Authentication {

    static ADMIN_ROLE = 0
    static ORGANIZER_ROLE = 1
    static PARTICIPANT_ROLE = 2

    static jwtCheck = (request, response, next) => {
        let authHeader = request.headers.authorization
        if (authHeader == null) return response.status(403).send({ message: "No Authentication header." })
        
        let jwtToken = authHeader.split(' ')
        if (jwtToken.length != 2) return response.status(401).send({ message: "Wrong auth header formating." })
        jwtToken = jwtToken[1]

        jwt.verify(jwtToken, Configuration.JWT_SECRET_KEY, (error, decodedToken) => {
            if (error) return response.status(401).send({ message: "Unauthorized access." })
            
            let role = decodedToken.role
            if (role == null) return response.status(401).send({ message: "Unauthorized access. Role is not specified in the token." })
            

            // access token fields and insert in into request
            request.role = role
            request.username = decodedToken.username
            request.email = decodedToken.email
            request.user_id = decodedToken._id


            next()
        })
    }

    static isAdmin = (request, response, next) => {
        let role = request.role

        if (role != Authentication.ADMIN_ROLE) 
            return response.status(401).send({ message: "Unauthorized access." })

        next()
    }

    static isOrganizer = (request, response, next) => {
        let role = request.role

        if (role != Authentication.ADMIN_ROLE && role != Authentication.ORGANIZER_ROLE) 
            return response.status(401).send({ message: "Unauthorized access." })

        next()
    }

    static isParticipant = (request, response, next) => {
        let role = request.role

        if (role != Authentication.PARTICIPANT_ROLE) 
            return response.status(401).send({ message: "Unauthorized access." })

        next()
    }
}