import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-admin-workshops',
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.css']
})
export class AdminWorkshopsComponent implements OnInit {

  constructor(
    private router: Router,
    private workshopService: WorkshopService,
    private userService: UserService,
  ) { }

  workshops: Workshop[]
  error: string

  ngOnInit(): void {
    RoleCheck.adminCheck(this.router)

    this.workshopService.getAllWorkshops().subscribe((data: Workshop[]) => {
      this.workshops = data
    })

    this.editable_workshop_id = ''
    this.error = ''
  }

  editable_workshop_id: string

  organizer_username: string
  name: string
  date: Date
  address: string
  short_description: string
  long_description: string
  capacity: number

  updateImages: boolean

  addNewWorkshop() {
    this.router.navigate([
      '/add_workshop'
    ])
  }

  deleteWorkshop(workshop) {
    this.workshopService.deleteWorkshop(workshop._id).subscribe((data) => {
      this.workshops = this.workshops.filter(w => w !== workshop)
    })
  }

  editWorkshop(workshop) {
    this.editable_workshop_id = workshop._id

    this.organizer_username = workshop.organizer.username // 
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

  // TO DO
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
    formData.append('organizer_username', this.organizer_username)
    formData.append('name', this.name)
    formData.append('date', '' + this.date + '')
    formData.append('address', this.address)
    formData.append('short_description', this.short_description)
    formData.append('long_description',this.long_description)
    formData.append('capacity', '' + this.capacity + '')
    formData.append('updateImages', '' + this.updateImages + '')

    this.workshopService.updateWorkshop(formData).subscribe((data: any) => {
      workshop.organizer_username = this.organizer_username
      workshop.name = this.name
      workshop.address = this.address
      workshop.short_description = this.short_description
      workshop.long_description = this.long_description
      workshop.capacity = this.capacity
      workshop.date = this.date
      workshop.images = data.images
    })

    this.editable_workshop_id = ''
    this.error = ''
    this.updateImages = false
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
