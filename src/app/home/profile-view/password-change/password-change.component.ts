import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Token} from '../../../auth/models/token';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';
import {UserInfoService} from '../../../auth/services/user-info.service';
import {Login} from '../../../auth/models/login';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {
  passwordChangeForm = this.fb.group({
    currPass: ['', Validators.required],
    newPass: ['', Validators.required],
    newPassConfirm: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private userInfoService: UserInfoService,
              private router: Router
  ) { }

  onSubmit() {
    console.log(this.passwordChangeForm.value);
    this.userInfoService.changePassword(this.currPass.value, this.newPass.value, this.newPassConfirm.value);
  }

  get currPass() { return this.passwordChangeForm.get('currPass'); }

  get newPass() { return this.passwordChangeForm.get('newPass'); }

  get newPassConfirm() { return this.passwordChangeForm.get('newPassConfirm'); }
}
