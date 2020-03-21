import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserInfoService} from '../../services/user-info.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.css']
})
export class ForgotPasswordViewComponent implements OnInit {

  forgotForm = this.fb.group({email: ['', Validators.required]});

  loading = false;

  constructor(private fb: FormBuilder,
              private userInfoService: UserInfoService,
              private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  get email() { return this.forgotForm.get('email'); }

  onSubmit() {
    this.loading = true;
    this.userInfoService.forgotPassword(this.email.value)
      .subscribe(() => {
        alert('Instructions to reset your password have been sent to your email address.' +
          'Please follow those instructions to reset your password.');
        this.loading = false;
        this.activeModal.close();
      });
  }

}
