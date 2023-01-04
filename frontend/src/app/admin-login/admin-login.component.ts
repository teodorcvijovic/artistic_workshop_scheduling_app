import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Configuration } from '../utils/config';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  /****** fields *******/

  username: string
  password: string
  error: string

  /****** methods ******/

  login() {
    if (!this.username) {
      this.error = 'Username is missing.'
      return
    }
    else if (!this.password) {
      this.error = 'Password is missing.'
      return
    }

    this.userService.login(this.username, this.password).subscribe({
      next: (data:any) => {
          let jwtToken = data.jwt_token
          let user = JSON.parse(data.user)

          if (user.role != Configuration.ADMIN_ROLE) {
            this.error = 'Only users with admin role can access this form.'
            return
          }

          SessionUtil.putJWT(jwtToken)
          SessionUtil.putUser(user)
          this.error = ''

          // window.location.reload()
          this.router.navigate(['/users'])
      },
      error: error => {
        this.error = error.error.message
      }
    })
  }

  // logout() {
  //   SessionUtil.clear()
  // }

  resetPassword() {
    this.router.navigate(['/reset_password'])
  }

}
