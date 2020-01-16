import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/services/auth.service';
import {Router} from '@angular/router';
import {ContentService} from './services/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private contentService: ContentService) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['logout']);
  }
}
