import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {ContentService} from '../../../content/services/content.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  public searchForm = this.fb.group({
    keywords: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private contentService: ContentService,
    private router: Router,
    private fb: FormBuilder
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

  submitSearch() {
    console.log(this.searchForm.value);
    this.router.navigate(['search'], {queryParams: {keywords: this.searchForm.get('keywords').value}});
  }

  get keywords() { return this.searchForm.get('keywords'); }
}
