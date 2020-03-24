import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService, jwtHelperService} from '../../services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserInfoService} from '../../services/user-info.service';
import {Token} from '../../models/token';

@Component({
  selector: 'app-reset-password-view',
  templateUrl: './reset-password-view.component.html',
  styleUrls: ['./reset-password-view.component.css']
})
export class ResetPasswordViewComponent implements OnInit {
  public loading = false;

  private resetToken: string;

  public resetForm = this.fb.group({
    newPassword: ['', Validators.required],
    newPasswordConfirm: ['', Validators.required]
  });

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private activeModal: NgbActiveModal,
              private userInfoService: UserInfoService,
              private authService: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('resetToken')) {
        this.resetToken = params.get('resetToken');
        // validate reset token
        if (jwtHelperService.isTokenExpired(this.resetToken)) {
          alert('This link has expired. Returning to the forgot password page.');
          this.router.navigate(['forgot']);
        } else {
          this.loading = false;
        }
      } else {
        alert('This link is invalid. Returning to the home page');
        this.router.navigate(['login']);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.userInfoService.resetUserPassword(this.resetToken,
      this.newPassword.value, this.newPasswordConfirm.value)
      .subscribe((data: Token) => {
        alert('Password changed successfully. Signing you in now. Please wait...');
        this.loading = true;
        const result = this.authService.validateAndStoreToken(data);
        if (result === true) {
          this.router.navigate(['home'])
            .then(() => this.loading = false);
        } else {
          alert('Sorry, an error occurred while attempting to sign you in. Please try signing in again');
          this.router.navigate(['login'])
            .then(() => this.loading = false);
        }
      });
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get newPasswordConfirm() {
    return this.resetForm.get('newPasswordConfirm');
  }
}
