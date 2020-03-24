import { Component, OnInit } from '@angular/core';
import {UserInformation} from '../../models/user-information';
import {UserInfoService} from '../../services/user-info.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  userList: Array<UserInformation> = null;

  constructor(private userInfoService: UserInfoService) { }

  ngOnInit() {
    // fetch list of users
    this.userInfoService.fetchAllUsers()
      .subscribe(userList => {
        userList.forEach(user => {
          this.userList.push(user);
        });
      });
  }

  deleteUser(user: UserInformation) {
    this.userInfoService.deleteUser(user)
      .subscribe(() => {
        alert('User ' + user.userUsername + ' deleted successfully');
        this.ngOnInit();
      }, (error) => {
        alert('An error occurred. Please try again later')
      });
  }

}
