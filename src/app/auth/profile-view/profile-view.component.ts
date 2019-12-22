import { Component, OnInit } from '@angular/core';
import {UserInfoService} from '../user-info.service';
import {UserInformation} from '../user-information';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(private userInfoService: UserInfoService,
              ) {
  }
  private user: UserInformation = new UserInformation();
  public loading: boolean;
  ngOnInit(): void {
    this.loading = true;
    this.fetchUser();
  }

  fetchUser(): void {
    this.userInfoService.fetchInfo().subscribe(result => {
      console.log(result);
      this.user.setUsername(result.username);
      this.user.setName(result.name);
      if (result.authLevel === UserInformation.ADMIN_ROLE) {
        this.user.setAuthLevel(false);
      } else {
        this.user.setAuthLevel(true);
      }
      this.loading = false;
    } );
  }
}
