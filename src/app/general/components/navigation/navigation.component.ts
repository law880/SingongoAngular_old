import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  get authenticated(): boolean { return this.authService.isAuthenticated(); }

  doAuthAction() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.router.navigate(['logout']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
