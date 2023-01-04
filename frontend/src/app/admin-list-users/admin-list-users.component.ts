import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
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
    this.error = ''

    this.username = user.username
    this.firstname = user.firstname
    this.password = user.password
    this.lastname = user.lastname
    this.phone = user.phone
    this.email = user.email
    this.organization_name = user.organization_name
    this.organization_address = user.organization_address
    this.organization_pib = user.organization_pib
    this.role = user.role
    this.myImage = user.image
  }

  cancelEdit() {
    this.editable_user_id = ''
    this.error = ''
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
      organization_pib: this.organization_pib,
      image: this.myImage
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
    user.image = this.myImage

    this.userService.updateUser(data).subscribe((data) => {
      this.editable_user_id = ''
      this.error = ''
    })

  }

  addNewUser() {
    this.router.navigate(['/add_user'])
  }

  /************* image upload *************/

  removeImage() {
    this.myImage = null
    this.error = "Image is removed."
  }

  myImage!: Observable<any>
  error: string

  onChange = ($event: Event) => {
    const target = $event.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]

    this.convertToBase64(file)
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber)
    })

    observable.subscribe((d) => {
      // console.log(d)
      this.myImage = d

      // check image size
      var img = new Image();
      img.onload = () => {
          let width = img.width
          let height = img.height
          // console.log(width)
          // console.log(height)
          this.checkImageDimensions(width, height)
      }
      img.src = this.myImage.toString()
    })
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    try {
      const filereader = new FileReader()
      filereader.readAsDataURL(file)
      filereader.onload = () => {
        subscriber.next(filereader.result)
        subscriber.complete()
      }

      filereader.onerror = () => {
        subscriber.error()
        subscriber.complete()
      }
    }
    catch {
      this.error = ''
      this.myImage = null
    }
  }

  checkImageDimensions(width, height) {
    if (width < 100 || width > 300 || height < 100 || height > 300) {
      // error
      this.error = 'Image size can be between 100x100px and 300x300px.'
      this.myImage = null
      return
    }
    this.error = ''
  }

}
