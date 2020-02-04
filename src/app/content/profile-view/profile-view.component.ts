import { Component, OnInit } from '@angular/core';
import {UserInfoService} from '../../auth/services/user-info.service';
import {UserInformation} from '../../auth/models/user-information';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PasswordChangeComponent} from './password-change/password-change.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(private userInfoService: UserInfoService,
              private modalService: NgbModal
              ) {
  }
  private user: UserInformation = new UserInformation();
  public loading: boolean;
  public authLevel: string;

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
        this.authLevel = 'Administrator';
      } else {
        this.user.setAuthLevel(true);
        this.authLevel = 'Singer';
      }
      this.loading = false;
    } );
  }

  openPasswordChange() {
    const modalRef = this.modalService.open(PasswordChangeComponent);
    modalRef.componentInstance.passPassword.subscribe();
    modalRef.result.then((newPassword: string) => {
      if (newPassword) {
        this.userInfoService.setCredentials(this.user.userUsername, newPassword)
      }
    });
  }
}
