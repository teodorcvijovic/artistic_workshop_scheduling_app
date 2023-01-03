import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  /****** fields *******/

  email: string
  message: string
  error: string

  /****** methods ******/

  sendResetLink() {
    if (!this.email) {
      this.error = 'Email field is mandatory.'
      this.message = ''
      return
    }

    this.userService.resetPassword(this.email).subscribe({
      next: (data:any) => {
          this.message = data.message
          this.error = ''
      },
      error: error => {
        this.error = error.error.message
        this.message = ''
      }
    })
  }
}
