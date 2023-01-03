import { Router } from "@angular/router";
import { Configuration } from "./config";
import { SessionUtil } from "./sessionutil";

export class RoleCheck {

    static adminCheck(router: Router) {
        let user = SessionUtil.getUser()
        if (user == null) return
        if (user.role == Configuration.ADMIN_ROLE) return
        router.navigate(['/login'])
    }

    static organizerCheck(router: Router) {
        let user = SessionUtil.getUser()
        if (user == null) return
        if (user.role == Configuration.ORGANIZER_ROLE || user.role == Configuration.ADMIN_ROLE) return
        router.navigate(['/login'])
    }
}