import { Component, OnInit } from '@angular/core';
import {MessageService} from '../../message.service';

@Component({
  selector: 'app-login-message',
  templateUrl: './login-message.component.html',
  styleUrls: ['./login-message.component.css']
})
export class LoginMessageComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
