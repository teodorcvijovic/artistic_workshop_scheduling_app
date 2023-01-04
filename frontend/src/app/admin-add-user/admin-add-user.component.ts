import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-admin-add-user',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.css']
})
export class AdminAddUserComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    RoleCheck.adminCheck(this.router)
  }

}
