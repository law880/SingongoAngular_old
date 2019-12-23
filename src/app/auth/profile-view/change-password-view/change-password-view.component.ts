import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-change-password-view',
  templateUrl: './change-password-view.component.html',
  styleUrls: ['./change-password-view.component.css']
})
export class ChangePasswordViewComponent implements OnInit {
  passwordChangeForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    newPasswordConfirm: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }
}
