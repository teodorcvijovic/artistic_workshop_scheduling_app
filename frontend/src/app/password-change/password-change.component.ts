import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { RoleCheck } from '../utils/role-check';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    RoleCheck.loggedCheck(this.router)
  }

  old_password: string
  new_password1: string
  new_password2: string
  error: string
  message: string

  changePassword() {
    if (!this.new_password1 || !this.new_password2) {
      this.error = 'Plase enter your new password in both fields.'
      this.message = ''
      return
    }

    // check regex
    if (!this.checkPasswords()) return

    this.userService.changePassword(this.old_password, this.new_password1).subscribe({
      next: (data:any) => {
          this.message = data.message
          this.error = ''

          SessionUtil.clear()
          this.router.navigate(['/login'])
      },
      error: error => {
        this.error = error.error.message
        this.message = ''
      }
    })
  }

  resetPassword() {
    this.router.navigate(['/reset_password'])
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

    if (this.new_password1 != this.new_password2) {
      this.error = 'Passwords in both fields should be the same.'
      this.message = ''
      return false
    }

    return true
  }

}
