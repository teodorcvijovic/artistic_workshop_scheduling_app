import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { RoleCheck } from '../utils/role-check';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-organizer-chat',
  templateUrl: './organizer-chat.component.html',
  styleUrls: ['./organizer-chat.component.css']
})
export class OrganizerChatComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService,
    private activityService: ActivityService,
    public https: HttpClient,
    private userService: UserService
  ) { }
  
  workshop: any = null
  threads = [] // thread, participant
  opened = []

  back() {
    this.router.navigate(['/organizer'])
  }

  ngOnInit(): void {
    RoleCheck.organizerCheck(this.router)
    this.workshop = localStorage.getItem('my-saved-workshop')
    if (this.workshop == null) {
      this.router.navigate(['/organizer'])
    }
    //localStorage.removeItem('my-saved-workshop')
    this.workshop = JSON.parse(this.workshop)
    console.log(this.workshop)
    this.activityService.getThreadsForWorkshop(this.workshop).subscribe((data: any) => {
      this.threads = data
      this.threads.forEach(th => {
        this.opened.push(false)
        this.message.push('')
      })
      console.log(data)
    })
  }

  //chatThread = null
  message = []

  openThread(th, i) {
    //this.chatThread = th
    this.opened[i] = true
  }

  closeThread(th, i) {
    this.opened[i] = false
  }

  sendMessage(chatThread, i) {
    this.activityService.sendMessage(chatThread.thread._id, this.message[i]).subscribe((data:any) => {
      chatThread.thread.messages.push(data)
      this.message[i] = ''
    }) 
  }

  getUser(chatThread, sender_id) {
    if (sender_id == SessionUtil.getUser()._id) 
      return SessionUtil.getUser()

    return chatThread.participant
  }

  // 0 - me, 1 - not me
  isMe(sender_id) {
    if (sender_id == SessionUtil.getUser()._id) 
      return true

    return false
  }

}
