import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { Configuration } from '../config';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
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

    if (!this.username || !this.password1 || !this.password2 || !this.firstname || !this.lastname || !this.phone || !this.email) {
      this.error = 'Please fill out all mandatory fields.'
      return
    }

    if (!this.checkPasswords()) return

    if (this.organization_name || this.organization_address || this.organization_pib) 
      this.role = Configuration.ORGANIZER_ROLE
    else 
      this.role = Configuration.PARTICIPANT_ROLE

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
    
    this.userService.register(data).subscribe({
      next: (data:any) => {
          this.error = ''
          this.router.navigate(['/login'])
      },
      error: error => {
          this.error = error.error.message
      }
    })
  }

  /**** helpers ****/

  checkPasswords() {
    const passwordRegex  = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#@\$%\^&\*\.])(?=.{8,16})/
    const passwordMustBeginWithLetterRegex = /^[a-zA-Z]/

    if (!passwordMustBeginWithLetterRegex.test(this.password1.toString())) {
      this.error = 'Password must begin with a letter.'
      return false
    }

    if (!passwordRegex.test(this.password1.toString())) {
      this.error = "Password should contain at least one capital letter, one number, and one special character. \
                    Lenght should be from 8 to 16 characters."
      return false
    }

    if (this.password1 != this.password2) {
      this.error = 'Passwords in both fields should be the same.'
      return false
    }

    return true
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
      return
    }
    this.error = ''
  }

}
