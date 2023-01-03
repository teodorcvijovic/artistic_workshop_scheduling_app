import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css']
})
export class RegistrationRequestsComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    RoleCheck.adminCheck(this.router)

    this.userService.getAllRequests().subscribe((data: User[]) => {
      this.requests = data
    })
  }

  requests: User[]

  acceptRequest(user) {
    this.userService.acceptRequest(user.username).subscribe((data) => {
      this.requests = this.requests.filter(u => u !== user)
      //window.location.reload()
    })
  }

  denyRequest(user) {
    this.userService.denyRequest(user.username).subscribe((data) => {
      this.requests = this.requests.filter(u => u !== user)
      //window.location.reload()
    })
  }

}
