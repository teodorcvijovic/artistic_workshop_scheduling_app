import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-profile-organizer',
  templateUrl: './profile-organizer.component.html',
  styleUrls: ['./profile-organizer.component.css']
})
export class ProfileOrganizerComponent implements OnInit {

  
  constructor(
    private router: Router,
    private workshopService: WorkshopService,
    private activityService: ActivityService,
    public https: HttpClient,
    private userService: UserService
  ) { }

  workshops: any = []
  error: string = ''

  ngOnInit(): void {
    RoleCheck.organizerCheck(this.router)

    this.workshopService.getWorkshopsOrganizedByMe().subscribe((data: any) => {
      this.workshops = data

    })

    this.editable_workshop_id = ''
    this.error = ''
  }

  editable_workshop_id: string

  name: string
  date: Date
  address: string
  short_description: string
  long_description: string
  capacity: number

  updateImages: boolean

  addNewWorkshop() {
    // TO DO

    // this.router.navigate([
    //   '/add_workshop'
    // ])
  }

  cancelWorkshop(workshop) {
    this.workshopService.cancelWorkshop(workshop._id).subscribe((data: any) => {
        this.workshops = this.workshops.filter(w => w !== workshop)
    })
  }

  editWorkshop(workshop) {
    this.editable_workshop_id = workshop._id

    this.name = workshop.name
    this.date = workshop.date
    this.address = workshop.address
    this.short_description = workshop.short_description
    this.long_description = workshop.long_description
    this.capacity = workshop.capacity
    // this.images
    this.updateImages = false

    this.error = ''
  }

  removeImages() {
    this.updateImages = true
    this.myFiles = []
    this.error = ''
  }

  cancelEdit() {
    this.editable_workshop_id = ''
    this.error = ''
  }

  commitWorkshopChanges(workshop) {
    if (this.myFiles.length < 1 && this.updateImages) {
      this.error = "Main picture is mandatory."
      return
    }


    const formData =  new  FormData();
    for  (var i =  0; i <  this.myFiles.length; i++)  {  
        formData.append("images",  this.myFiles[i]);
    } 

    formData.append('_id', workshop._id)
    formData.append('name', this.name)
    formData.append('date', '' + this.date + '')
    formData.append('address', this.address)
    formData.append('short_description', this.short_description)
    formData.append('long_description',this.long_description)
    formData.append('capacity', '' + this.capacity + '')
    formData.append('updateImages', '' + this.updateImages + '')

    this.workshopService.updateWorkshop(formData).subscribe((data: any) => {
      workshop.name = this.name
      workshop.address = this.address
      workshop.short_description = this.short_description
      workshop.long_description = this.long_description
      workshop.capacity = this.capacity
      workshop.date = this.date
      workshop.images = data.images
    })

    this.editable_workshop_id = ''
    this.updateImages = false // ADDED
    this.error = ''
  }

   myFiles: string[] = [];


  onFileChange(event) {
      if (this.myFiles.length + event.target.files.length >= 5) {
        this.error = "You can not add more than 5 images."
        return
      }
      this.updateImages = true
      for (var i = 0; i  < event.target.files.length; i++){
          this.myFiles.push(event.target.files[i]);
      }
      this.error = ''
  }



}
