import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionUtil } from './sessionutil';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My App Component';

  constructor(
    private router: Router
  ) {}

  logged: boolean

  ngOnInit() {
    this.logged = false

    if (SessionUtil.getJWT() != '') this.logged = true
  }

  logout() {
    SessionUtil.clear()
    this.router.navigate(['/'])
  }
}
