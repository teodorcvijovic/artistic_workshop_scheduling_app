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

  toggleLikes() {
    if (!this.showLikes && !this.iLikedSimilarWorkshop) {
      this.error = 'Can\'t like workshop nor see who liked.'
      return
    }
    this.error = ''
    this.showLikes = !this.showLikes
    if (this.showLikes) this.showComments = false
  }

  toggleComments() {
    this.error = ''
    this.showComments = !this.showComments
    if (this.showComments) this.showLikes = false
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

}
