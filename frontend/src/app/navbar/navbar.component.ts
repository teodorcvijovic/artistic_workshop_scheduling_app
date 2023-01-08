import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoleCheck } from '../utils/role-check';
import { SessionUtil } from '../utils/sessionutil';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  logged: boolean
  isAdmin: boolean
  isParticipant: boolean
  isOrganizer: boolean

  mySubscription: Subscription
  

  ngOnInit() {
    this.logged = RoleCheck.isLogged()
    this.isAdmin = RoleCheck.isAdmin()
    this.isOrganizer = RoleCheck.isOrganizer()
    this.isParticipant = RoleCheck.isParticipant()

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  logout() {
    SessionUtil.clear()
    // window.location.reload()
    this.router.navigate([''])
  }

  
}
