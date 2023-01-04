import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { UserService } from '../services/user.service';
import { Configuration } from '../utils/config';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-admin-add-user',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.css']
})
export class AdminAddUserComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    RoleCheck.adminCheck(this.router)
    this.error = ''
    this.role = Configuration.PARTICIPANT_ROLE
  }

  /****** fields ******/

  username: string
  password1: string
  password2: string
  firstname: string
  lastname: string
  phone: string
  email: string
  role: number
  organization_name: string
  organization_address: string
  organization_pib: string
  
  error: string

  /***** methods ******/

  register() {
    if (this.error != '') return

    let data = {
      username: this.username,
      password: this.password1,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      email: this.email,
      role: this.role,
      organization_name: this.organization_name,
      organization_address: this.organization_address,
      organization_pib: this.organization_pib,
      image: this.myImage
    }
    
    this.userService.createUser(data).subscribe({
      next: (data:any) => {
          this.error = ''
          this.router.navigate(['/users'])
      },
      error: error => {
          this.error = error.error.message
      }
    })
  }

  cancel() {
    this.router.navigate(['/users'])
  }

  /************* image upload *************/

  myImage!: Observable<any>
  base64code!: any

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
      this.base64code = d

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
    }
  }

  checkImageDimensions(width, height) {
    if (width < 100 || width > 300 || height < 100 || height > 300) {
      // error
      this.error = 'Image size can be between 100x100px and 300x300px.'
      this.myImage = null
      this.base64code = null
      return
    }
    this.error = ''
  }

}
