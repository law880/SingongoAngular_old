import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Token} from '../../../auth/models/token';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';
import {UserInfoService} from '../../../auth/services/user-info.service';
import {Login} from '../../../auth/models/login';
import {MessageService} from '../../../auth/services/message.service';
import {PASSWORD_CHANGE_COMPONENT} from '../../../constants';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {
  @Output() passPassword: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
              private userInfoService: UserInfoService,
              private router: Router,
              private messageService: MessageService,
              public activeModal: NgbActiveModal
  ) { }

  get currPass() { return this.passwordChangeForm.get('currPass'); }

  get newPass() { return this.passwordChangeForm.get('newPass'); }

  get newPassConfirm() { return this.passwordChangeForm.get('newPassConfirm'); }

  get compName() { return PASSWORD_CHANGE_COMPONENT; }

  passwordChangeForm = this.fb.group({
    currPass: ['', Validators.required],
    newPass: ['', Validators.required],
    newPassConfirm: ['', Validators.required]
  });

  loading = false;

  passwordsEqual = true;

  onSubmit() {
    console.log(this.passwordChangeForm.value);
    this.loading = true;
    if (this.newPass.value !== this.newPassConfirm.value) {
      this.passwordsEqual = false;
      this.loading = false;
    } else {
      this.userInfoService.changePassword(this.currPass.value, this.newPass.value, this.newPassConfirm.value)
        .subscribe(() => {
          this.loading = false;
          alert('Password changed successfully.');
          this.passBack();
        });
    }
  }

  passBack() {
    this.activeModal.close(this.passwordChangeForm.get('newPass').value);
  }
}
