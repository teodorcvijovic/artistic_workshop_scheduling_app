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

  ngOnInit(): void {
    RoleCheck.organizerCheck(this.router)
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

  myFiles: string[] = [];

  onFileChange(event) {
      if (event.target.files.length > 5) {
        this.error = "You can not add more than 5 images."
        return
      }
      for (var i = 0; i  < event.target.files.length; i++){
          this.myFiles.push(event.target.files[i]);
      }
      this.error = ''
  }

}

