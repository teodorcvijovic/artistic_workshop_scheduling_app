import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../models/workshop';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService,
    public https: HttpClient
  ) { }

  workshop: any
  public static address: string = 'Vodovodska%2092'

  ngOnInit(): void {
    let workshopString = localStorage.getItem('workshop_detailed')
    if (workshopString == '' || workshopString == null) {
      this.router.navigate(['/home'])
    }
    this.workshop = JSON.parse(workshopString)
  }

  back() {
    this.router.navigate(['/home'])
  }

}
