import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SessionUtil } from '../sessionutil';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
          
          SessionUtil.putJWT(jwtToken)
          SessionUtil.putUser(user)
          this.error = ''

          // TODO: redirect
      },
      error: error => {
        this.error = error.error.message
      }
    })
  }

  logout() {
    SessionUtil.clear()

    // TODO: redirect
  }

  resetPassword() {
    this.router.navigate(['/reset_password'])
  }

  register() {
    this.router.navigate(['/register'])
  }
}
