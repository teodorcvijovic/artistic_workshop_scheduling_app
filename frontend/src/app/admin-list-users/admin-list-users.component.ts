import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Configuration } from '../utils/config';
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

    this.editable_user_id = ''
  }

  users: User[]

  editable_user_id: string
  username: string
  password: string
  firstname: string
  lastname: string
  phone: string
  email: string
  organization_name: string
  organization_address: string
  organization_pib: string
  role: number

  deleteUser(user) {
    if (user.username == SessionUtil.getUser().username) {
      // just in case admin deletes himself
      SessionUtil.clear()
      this.router.navigate([''])
    }

    this.userService.deleteUser(user._id).subscribe((data) => {
      this.users = this.users.filter(u => u !== user)
    })
  }

  editUser(user) {
    this.editable_user_id = user._id

    this.username = user.username
    this.firstname = user.firstname
    this.lastname = user.lastname
    this.phone = user.phone
    this.email = user.email
    this.organization_name = user.organization_name
    this.organization_address = user.organization_address
    this.organization_pib = user.organization_pib
    this.role = user.role
  }

  cancelEdit() {
    this.editable_user_id = ''
  }

  commitUserChanges(user) {
    if (this.role == Configuration.PARTICIPANT_ROLE) {
      this.organization_name = ''
      this.organization_address = ''
      this.organization_pib = ''
    }

    let data = {
      _id: user._id,
      username: this.username,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
      phone: this.phone,
      email: this.email,
      organization_name: this.organization_name,
      organization_address: this.organization_address,
      organization_pib: this.organization_pib
    }

    user.username = this.username
    user.password = this.password
    user.firstname = this.firstname
    user.lastname = this.lastname
    user.phone = this.phone
    user.email = this.email
    user.role = this.role
    user.organization_name = this.organization_name
    user.organization_address = this.organization_address
    user.organization_pib = this.organization_pib

    this.userService.updateUser(data).subscribe((data) => {
      this.editable_user_id = ''
    })

  }

  addNewUser() {
    this.router.navigate(['/add_user'])
  }

}
