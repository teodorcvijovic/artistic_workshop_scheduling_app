import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshop';
import { ActivityService } from '../services/activity.service';
import { WorkshopService } from '../services/workshop.service';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService,
    private activityService: ActivityService,
    public https: HttpClient
  ) { }

  workshop: any
  comments: any = []
  address: string = ''
  comment: string = ''

  /*
    {organizer: ..., thread: ...}

  */
  chatThread: any = null

  ngOnInit(): void {
    let workshopString = localStorage.getItem('workshop_detailed')
    if (workshopString == '' || workshopString == null) {
      this.router.navigate(['/home'])
    }
    this.workshop = JSON.parse(workshopString)

    this.activityService.getWorkshopComments(this.workshop).subscribe((data: any) => {
      if (data) this.comments = data
    })

    this.workshopService.getMyPreviousWorkshops().subscribe((data: any) => {
      let workshops = data
      workshops.forEach(w => {
        if (w._id != this.workshop._id && w.name.toLowerCase() == this.workshop.name.toLowerCase()) {
          w.participants.forEach(p => {
            if (p.username == SessionUtil.getUser().username) this.iLikedSimilarWorkshop = true 
          })
        }
      })
    })

    this.activityService.getThread(this.workshop).subscribe((data: any) => {
      if (data == null) return
      else this.chatThread = data
    })
  }

  back() {
    this.router.navigate(['/home'])
  }

  getMapURL() {
    let address: string[] = this.workshop.address.split(' ')
    let address2 = address.join('%20')
    return `https://maps.google.com/maps?q=${address2}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  }

  /**********************/

  showLikes = false
  showComments = false
  showChat = false

  toggleLikes() {
    if (!this.showLikes && !this.iLikedSimilarWorkshop) {
      this.error = 'Can\'t like workshop nor see who liked.'
      return
    }
    this.error = ''
    this.showLikes = !this.showLikes
    if (this.showLikes) {
      this.showComments = false
      this.showChat = false
    }
  }

  toggleComments() {
    this.error = ''
    this.showComments = !this.showComments
    if (this.showComments) {
      this.showLikes = false
      this.showChat = false
    }
  }

  toggleChat() {
    this.error = ''
    this.showChat = !this.showChat
    if (this.showChat) {
      this.showLikes = false
      this.showComments = false
    }
  }

  error: string = ''
  iLikedSimilarWorkshop: boolean

  iLiked() {
    let ret = false
    this.workshop.likes.forEach(l => {
      if (l.username == SessionUtil.getUser().username) ret = true
    })
    return ret
  }

  like() {
    this.activityService.like(this.workshop).subscribe((data: any) => {
      this.workshop.likes.push(SessionUtil.getUser())
    })
  }

  unlike() {
    this.activityService.unlike(this.workshop).subscribe((data: any) => {
      this.workshop.likes = this.workshop.likes.filter(l => l.username != SessionUtil.getUser().username)
      localStorage.removeItem('workshop_detailed')
      localStorage.setItem('workshop_detailed', JSON.stringify(this.workshop))
    })
  }

  /******************* */

  postComment() {
    this.activityService.sendComment(this.workshop._id, this.comment).subscribe((data: any) => {
      this.comment = ''
      this.comments.push(data)
    })
  }

  startThread() {
    if (this.chatThread != null) return

    this.activityService.createThread(this.workshop).subscribe((data: any) => {
      this.chatThread = data
    })
  }

  message: string = ''

  sendMessage() {
    this.activityService.sendMessage(this.chatThread.thread._id, this.message).subscribe((data:any) => {
      this.chatThread.thread.messages.push(data)
      this.message = ''
    }) 
  }

  getUser(sender_id) {
    if (sender_id == SessionUtil.getUser()._id) 
      return SessionUtil.getUser()

    return this.chatThread.organizer
  }

  // 0 - me, 1 - not me
  isMe(sender_id) {
    if (sender_id == SessionUtil.getUser()._id) 
      return true

    return false
  }

}
