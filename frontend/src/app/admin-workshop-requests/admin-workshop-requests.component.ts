import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshop';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-admin-workshop-requests',
  templateUrl: './admin-workshop-requests.component.html',
  styleUrls: ['./admin-workshop-requests.component.css']
})
export class AdminWorkshopRequestsComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService
  ) { }

  requests: Workshop[]
  error: string = ''

  ngOnInit(): void {
    this.workshopService.getAllRequestsForOrganizing().subscribe((data: any) => {
      this.requests = data
    })
  }

  acceptRequest(workshop) {
    this.error = ''
    this.workshopService.permitNewWorkshop(workshop._id).subscribe({
      next: (data: any) => {
        this.requests = this.requests.filter(r => r._id != workshop._id)
      },
      error: (error) => {
        this.error = error.error.message
      }
    })
  }

  denyRequest(workshop) {
    this.error = ''
    this.workshopService.deleteWorkshop(workshop._id).subscribe((data: any) => {
      this.requests = this.requests.filter(r => r._id != workshop._id)
    })
  }

}
