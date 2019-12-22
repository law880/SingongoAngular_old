import {Component, OnInit} from '@angular/core';
import {Login} from '../login';
import {FormBuilder, Validators} from '@angular/forms';
import {Token} from '../token';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {UserInfoService} from '../user-info.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  token: Token;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private userInfoService: UserInfoService
  ) { }

  onSubmit() {
    console.log(this.loginForm.value);
    const loginInfo = new Login(this.loginForm.value.username, this.loginForm.value.password);
    this.authService.login(loginInfo)
       .subscribe(token => {
         localStorage.setItem('token', token.token);
         this.userInfoService.setCredentials(loginInfo.username, loginInfo.password);
         console.log('username in login ' + this.userInfoService.user.userUsername);
         this.router.navigate(['home']);
       });
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }
}
