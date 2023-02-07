import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { RoleCheck } from '../utils/role-check';

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

  ngOnInit(): void {
    RoleCheck.organizerCheck(this.router)
    this.workshop = localStorage.getItem('my-saved-workshop')
    if (this.workshop == null) {
      this.router.navigate(['/organizer'])
    }
    localStorage.removeItem('my-saved-workshop')
    this.workshop = JSON.parse(this.workshop)
    console.log(this.workshop)
    this.activityService.getThreadsForWorkshop(this.workshop).subscribe((data: any) => {
      this.threads = data
      console.log(data)
    })
  }

}
