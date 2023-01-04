import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleCheck } from '../utils/role-check';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    RoleCheck.loggedCheck(this.router)
  }

}
