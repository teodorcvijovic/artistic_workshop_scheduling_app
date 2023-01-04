import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { RoleCheck } from '../utils/role-check';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-admin-list-users',
  templateUrl: './admin-list-users.component.html',
  styleUrls: ['./admin-list-users.component.css']
})
export class AdminListUsersComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    RoleCheck.adminCheck(this.router)

    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data
    })
  }

  users: User[]

  username: string
  password: string
  firstname: string
  lastname: string
  

  deleteUser(user) {
    if (user.username == SessionUtil.getUser().username) {
      // just in case admin delete himself
      SessionUtil.clear()
      this.router.navigate([''])
    }

    this.userService.deleteUser(user._id).subscribe((data) => {
      this.users = this.users.filter(u => u !== user)
    })
  }

  updateUser() {
    // TO DO
  }

}
