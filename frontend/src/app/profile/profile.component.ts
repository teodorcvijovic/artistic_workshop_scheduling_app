import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { User } from '../models/user';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { Configuration } from '../utils/config';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService,
    private activityService: ActivityService,
    public https: HttpClient,
    private userService: UserService
  ) { }

  page: number = 0
  user: any = null
  editable_user_id: string

  ngOnInit(): void {
    this.user = SessionUtil.getUser()
    this.editable_user_id = ''

    this.workshopService.getMyPreviousWorkshops().subscribe((data: any) => {
      this.previousWorkshops = data
    })

    this.activityService.getMyLikes().subscribe((data: any) => {
      this.likes = data
    })

    this.activityService.getMyComments().subscribe((data: any) => {
      this.comments = data
    })
  }

  showProfile() {
    this.page = 0
  }

  showWorkshops() {
    this.page = 1
    this.cancelEdit()
  }

  showActions() {
    this.page = 2
    this.cancelEdit()

  }

  showThreads() {
    this.page = 3
    this.cancelEdit()

  }

  /************ profile *********************/

  username: string
  password: string
  firstname: string
  lastname: string
  phone: string
  email: string

  error: string = ''

  editUser() {
    this.editable_user_id = this.user._id
    this.error = ''

    this.username = this.user.username
    this.firstname = this.user.firstname
    this.password = this.user.password
    this.lastname = this.user.lastname
    this.phone = this.user.phone
    this.email = this.user.email
    this.myImage = this.user.image
  }

  cancelEdit() {
    this.editable_user_id = ''
    this.error = ''
  }

  commitUserChanges() {
    let data = {
      _id: this.user._id,
      username: this.username,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      email: this.email,
      organization_name: '',
      organization_address: '',
      organization_pib: '',
      image: this.myImage
    }

    this.user.username = this.username
    this.user.password = this.password
    this.user.firstname = this.firstname
    this.user.lastname = this.lastname
    this.user.phone = this.phone
    this.user.email = this.email
    this.user.image = this.myImage

    this.userService.updateUser(data).subscribe((data) => {
      this.editable_user_id = ''
      this.error = ''
    })

  }

  /************* image upload *************/

  removeImage() {
    this.myImage = null
    this.error = "Image is removed."
  }

  myImage!: Observable<any>

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

  /******************************************/

  previousWorkshops: any = null

  sortCriteria: string = 'name'
  sortDir: boolean = true

  sort() {
    if (this.sortCriteria == 'name') {
      if (this.sortDir == true) {
        this.previousWorkshops.sort((w1, w2) => {
          if (w1.name.toLowerCase() > w2.name.toLowerCase()) return 1
          else if (w1.name.toLowerCase() < w2.name.toLowerCase()) return -1
          return 0
        })
      }
      else {
        this.previousWorkshops.sort((w1, w2) => {
          if (w1.name.toLowerCase() > w2.name.toLowerCase()) return -1
          else if (w1.name.toLowerCase() < w2.name.toLowerCase()) return 1
          return 0
        })
      }
    }
    if (this.sortCriteria == 'organizer') {
      if (this.sortDir == true) {
        this.previousWorkshops.sort((w1, w2) => {
          if (w1.organizer.username.toLowerCase() > w2.organizer.username.toLowerCase()) return 1
          else if (w1.organizer.username.toLowerCase() < w2.organizer.username.toLowerCase()) return -1
          return 0
        })
      }
      else {
        this.previousWorkshops.sort((w1, w2) => {
          if (w1.organizer.username.toLowerCase() > w2.organizer.username.toLowerCase()) return -1
          else if (w1.organizer.username.toLowerCase() < w2.organizer.username.toLowerCase()) return 1
          return 0
        })
      }
    }
    if (this.sortCriteria == 'address') {
      if (this.sortDir == true) {
        this.previousWorkshops.sort((w1, w2) => {
          if (w1.address.toLowerCase() > w2.address.toLowerCase()) return 1
          else if (w1.address.toLowerCase() < w2.address.toLowerCase()) return -1
          return 0
        })
      }
      else {
        this.previousWorkshops.sort((w1, w2) => {
          if (w1.address.toLowerCase() > w2.address.toLowerCase()) return -1
          else if (w1.address.toLowerCase() < w2.address.toLowerCase()) return 1
          return 0
        })
      }
    }
    if (this.sortCriteria == 'date') {
      this.previousWorkshops.sort((w1, w2) => {
        let d1 = new Date(w1.date)
        let d2 = new Date(w2.date)
        let diff = d1.getTime() - d2.getTime()
        return diff
      })

      if (!this.sortDir) this.previousWorkshops.reverse()
    }
  }

  /****************************************************************/

  likes: any = []
  comments: any = []

  editable_index = -1
  content: string = ''

  unlike(like) {
    this.activityService.unlike(like).subscribe((data) => {
      this.likes = this.likes.filter(w => w._id != like._id)
    })
  }

  editComment(comment, i) {
    this.editable_index = i
    this.content = comment.comment.content
  }

  cancelEditComm() {
    this.editable_index = -1
  }

  commitCommEdit() {
    let comment_id = this.comments[this.editable_index].comment._id
    this.activityService.updateComment(comment_id, this.content).subscribe((data:any) => {
      this.comments[this.editable_index].comment.content = this.content
      this.editable_index = -1
    })

  }

  deleteComm() {
    let comment_id = this.comments[this.editable_index].comment._id
    this.activityService.deleteComment(comment_id).subscribe((data:any) => {
      this.comments = this.comments.filter(c => {
        return c.comment._id != comment_id
      })
      this.editable_index = -1
    })
  }
}
