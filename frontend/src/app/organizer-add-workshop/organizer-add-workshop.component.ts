import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-organizer-add-workshop',
  templateUrl: './organizer-add-workshop.component.html',
  styleUrls: ['./organizer-add-workshop.component.css']
})
export class OrganizerAddWorkshopComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private workshopService: WorkshopService
  ) { }

  error: string = ''

  name: string
  date: Date
  address: string
  short_description: string
  long_description: string
  capacity: number = 1

  templates = []

  ngOnInit(): void {
    RoleCheck.organizerCheck(this.router)

    this.workshopService.getTemplates().subscribe((data: any) => {
      this.templates = data
    })
  }

  cancel() {
    this.router.navigate(['/organizer'])
  }

  addWorkshop() {
    if (this.myFiles.length < 1) {
      this.error = "Main picture is mandatory."
      return
    }

    const formData =  new  FormData();
    for  (var i =  0; i <  this.myFiles.length; i++)  {  
        formData.append("images",  this.myFiles[i]);
    } 

    formData.append('name', this.name)
    formData.append('date', '' + this.date + '')
    formData.append('address', this.address)
    formData.append('short_description', this.short_description)
    formData.append('long_description',this.long_description)
    formData.append('capacity', '' + this.capacity + '')

    this.workshopService.newWorkshopRequest(formData).subscribe({
      next: (data: any) => {
        this.router.navigate(['/organizer'])
      },
      error: (error) => {
        this.error = error.error.message
      }
  })

    this.error = ''
  }

  myFiles: any[] = [];

  onFileChange(event) {
      if (event.target.files.length > 5) {
        this.error = "You can not add more than 5 images."
        return
      }
      for (var i = 0; i  < event.target.files.length; i++){
          let f = event.target.files[i]
          console.log(f)
          this.myFiles.push(f);
      }
      this.error = ''
  }

  async selectTemplate(workshop) {
    this.name=workshop.name
    this.date=workshop.date
    this.address=workshop.address
    this.short_description=workshop.short_description
    this.long_description=workshop.long_description
    this.capacity=workshop.capacity
    // this.myFiles=workshop.images
    this.myFiles = []
    for(let i = 0; i < workshop.images.length; i++) {
      this.workshopService.getImage(workshop.images[i].path).subscribe((data:any) => {
        this.myFiles.push(new File([data], workshop.images[i].filename, {lastModified: workshop.images[i].lastModified, type: workshop.images[i].mimetype}))
      })
    }
  }

  removeImages() {
    this.myFiles = []
  }

}

