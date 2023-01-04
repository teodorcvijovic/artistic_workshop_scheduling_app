import { Configuration } from "./config";

export class SessionUtil {

    static JWT_KEY_NAME = 'jwt_token_key'
    static USER_KEY_NAME = 'user_key'

    static getJWT() {
        let token = window.sessionStorage.getItem(this.JWT_KEY_NAME)

        if (token == null) token = ''

        return token
    }

    static putJWT(token) {
        window.sessionStorage.removeItem(SessionUtil.JWT_KEY_NAME)
        window.sessionStorage.setItem(SessionUtil.JWT_KEY_NAME, token)
    }

    static getUser() {
        let user = window.sessionStorage.getItem(this.USER_KEY_NAME)

        if (user == null) return {}

        return JSON.parse(user);
    }

    static putUser(user) {
        window.sessionStorage.removeItem(SessionUtil.USER_KEY_NAME)
        window.sessionStorage.setItem(SessionUtil.USER_KEY_NAME, JSON.stringify(user))
    }

    static isLogged() {
        return window.sessionStorage.getItem(this.USER_KEY_NAME) != null
    }

    static clear() {
        window.sessionStorage.clear()
    }
}