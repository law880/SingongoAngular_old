import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../auth/services/message.service';
import {LoginFormComponent} from '../auth/login-form/login-form.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() componentName: string;

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

  get message(): string {
    return this.messageService.getMessage(this.componentName);
  }

  hasMessage(): boolean {
    return this.messageService.hasMessage(this.componentName);
  }

}
