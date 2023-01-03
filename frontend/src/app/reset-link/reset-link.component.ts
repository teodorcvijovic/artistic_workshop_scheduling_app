import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-link',
  templateUrl: './reset-link.component.html',
  styleUrls: ['./reset-link.component.css']
})
export class ResetLinkComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email']
      this.key = params['key']
    })
  }

  /****** fields *******/

  email: string
  key: string
  new_password1: string
  new_password2: string
  error: string
  message: string

  /****** methods ******/

  changePassword() {
    if (!this.new_password1 || !this.new_password2) {
      this.error = 'Plase enter your new password in both fields.'
      this.message = ''
      return
    }

    // check regex
    if (!this.checkPasswords()) return

    if (this.new_password1 != this.new_password2) {
      this.error = 'Passwords in both fields should be the same.'
      this.message = ''
      return
    }

    this.userService.resetLink(this.email, this.key, this.new_password1).subscribe({
      next: (data:any) => {
          this.message = data.message
          this.error = ''

          this.router.navigate(['/login'])
      },
      error: error => {
        this.error = error.error.message
        this.message = ''
      }
    })
  }

  /**** helpers ****/

  checkPasswords() {
    const passwordRegex  = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#@\$%\^&\*\.])(?=.{8,16})/
    const passwordMustBeginWithLetterRegex = /^[a-zA-Z]/

    if (!passwordMustBeginWithLetterRegex.test(this.new_password1.toString())) {
      this.error = 'Password must begin with a letter.'
      this.message = ''
      return false
    }

    if (!passwordRegex.test(this.new_password1.toString())) {
      this.message = ''
      this.error = "Password should contain at least one capital letter, one number, and one special character. \
                    Lenght should be from 8 to 16 characters."
      return false
    }

    return true
  }
}
