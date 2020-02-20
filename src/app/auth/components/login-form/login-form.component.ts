import {Component, OnInit} from '@angular/core';
import {Login} from '../../models/login';
import {FormBuilder, Validators} from '@angular/forms';
import {Token} from '../../models/token';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserInfoService} from '../../services/user-info.service';
import {LOGIN_FORM_COMPONENT} from '../../../constants';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
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

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']);
    }
  }

  onSubmit() {
    console.log(this.loginForm.value);
    const loginInfo = new Login(this.loginForm.value.username, this.loginForm.value.password);
    this.authService.login(loginInfo)
       .subscribe(token => {
         localStorage.setItem('token', token.token);
         localStorage.setItem('refreshToken', token.refreshToken);
         this.userInfoService.setCredentials(loginInfo.username, loginInfo.password);
         console.log('username in login ' + this.userInfoService.currentUser.userUsername);
         this.router.navigate(['home']);
       });
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

  get compName() { return LOGIN_FORM_COMPONENT; }
}
