import { Router } from "@angular/router";
import { Configuration } from "./config";
import { SessionUtil } from "./sessionutil";

export class RoleCheck {

    static adminCheck(router: Router) {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) router.navigate(['/admin_login'])
        if (user.role == Configuration.ADMIN_ROLE) return
        router.navigate(['/admin_login'])
    }

    static isAdmin() {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) return false
        if (user.role == Configuration.ADMIN_ROLE) return true
        return false
    }

    static organizerCheck(router: Router) {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) router.navigate(['/login'])
        if (user.role == Configuration.ORGANIZER_ROLE || user.role == Configuration.ADMIN_ROLE) return
        router.navigate(['/login'])
    }

    static isOrganizer() {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) return false
        if (user.role == Configuration.ORGANIZER_ROLE) return true
        return false
    }

    static isParticipant() {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) return false
        if (user.role == Configuration.PARTICIPANT_ROLE) return true
        return false
    }

    static loggedCheck(router: Router) {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) router.navigate(['/login'])
    }

    static isLogged() {
        let user = SessionUtil.getUser()
        if (user == null || Object.keys(user).length == 0) return false
        return true
    }
}