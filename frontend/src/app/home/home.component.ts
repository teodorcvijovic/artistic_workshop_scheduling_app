import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshop';
import { WorkshopService } from '../services/workshop.service';
import { RoleCheck } from '../utils/role-check';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService,
  ) { }

  logged: boolean
  isParticipant: boolean
  message: string = ''

  unfilteredActiveWorkshops: Workshop[] = []
  activeWorkshops: Workshop[] = []
  top5Workshops: Workshop[]
  myCurrentWorkshops: Workshop[]
  

  ngOnInit(): void {
    this.logged = RoleCheck.isLogged()
    this.isParticipant = RoleCheck.isParticipant()

    this.workshopService.getAllActiveWorkshops().subscribe((data: any) => {
      data.forEach(w => {
        this.activeWorkshops.push(w)
        this.unfilteredActiveWorkshops.push(w)
      });
      // this.activeWorkshops = data
      // this.unfilteredActiveWorkshops = data
    })

    this.workshopService.getTop5Workshops().subscribe((data: any) => {
      this.top5Workshops = data
    })

    if (this.isParticipant) {
      this.workshopService.getMyCurrentWorkshops().subscribe((data: any) => {
        this.myCurrentWorkshops = data
      })
    }
  }

  filterAndSort: boolean = false
  openFilterAndSort() { this.filterAndSort = true }
  closeFilterAndSort() { this.filterAndSort = false }

  name: string = ''
  address: string = ''
  search() {
    this.activeWorkshops = this.unfilteredActiveWorkshops
    if (this.name == '' && this.address == '') {
      return
    }

    if (this.name != '') this.activeWorkshops = this.unfilteredActiveWorkshops.filter(
      w => w.name.toLowerCase().includes(this.name.toLowerCase())
    )

    if (this.address != '') this.activeWorkshops = this.activeWorkshops.filter(
      w => w.address.toLowerCase().includes(this.address.toLowerCase())
    )
  }

  sortCriteria: string = 'name'
  sortDir: boolean = true
  sort() {
    if (this.sortCriteria == 'name') {
      if (this.sortDir == true) {
        this.activeWorkshops.sort((w1, w2) => {
          if (w1.name.toLowerCase() > w2.name.toLowerCase()) return 1
          else if (w1.name.toLowerCase() < w2.name.toLowerCase()) return -1
          return 0
        })
      }
      else {
        this.activeWorkshops.sort((w1, w2) => {
          if (w1.name.toLowerCase() > w2.name.toLowerCase()) return -1
          else if (w1.name.toLowerCase() < w2.name.toLowerCase()) return 1
          return 0
        })
      }
    }
    if (this.sortCriteria == 'date') {
      this.activeWorkshops.sort((w1, w2) => {
        let d1 = new Date(w1.date)
        let d2 = new Date(w2.date)
        let diff = d1.getTime() - d2.getTime()
        return diff
      })

      if (!this.sortDir) this.activeWorkshops.reverse()
    }
  }

  /*********** participant *********/

  seeWorkshopDetails(workshop) {
    localStorage.removeItem('workshop_detailed')
    localStorage.setItem('workshop_detailed', JSON.stringify(workshop))
    this.router.navigate(['/workshop_details'])
  }

  canCancel(workshopDate: Date) {
    workshopDate = new Date(workshopDate)
    let currDate = new Date()
    if (workshopDate.getTime() - currDate.getTime() < 12 * 60 * 60 * 1000)  {
      return false
    }
    return true
  }

  cancelParticipation(workshop) {
    this.message = ''
    this.workshopService.cancelParticipation(workshop._id).subscribe((data: any) => {
      this.myCurrentWorkshops = this.myCurrentWorkshops.filter(w => w._id != workshop._id)
      this.activeWorkshops.push(workshop)
    })
  }

  apply(workshop) {
    this.message = ''
    this.workshopService.applyForWorkshop(workshop._id).subscribe((data: any) => {
      this.message = data.message

      this.activeWorkshops = this.activeWorkshops.filter(w => w._id != workshop._id)
      this.myCurrentWorkshops.push(workshop)
    })
  }

  addMeToWaitList(workshop) {
    this.message = ''
    this.workshopService.putMeInWaitingQueue(workshop._id).subscribe((data: any) => {
      this.message = data.message
      workshop.waiting_queue.push(SessionUtil.getUser())
    })
  }

  isParticipating(workshop) {
    let ret = false
    workshop.participants.forEach(p => {
      if (p.username == SessionUtil.getUser().username) ret = true
    })

    return ret
  }

  canApply(workshop){
    return workshop.participants.length + workshop.reservations.length < workshop.capacity
  }

  isWaiting(workshop) {
    let ret = false
    workshop.waiting_queue.forEach(p => {
      if (p.username == SessionUtil.getUser().username) ret = true
    })

    return ret
  }

}
