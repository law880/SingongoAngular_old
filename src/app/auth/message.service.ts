import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  message: string;

  add(message: string) {
    this.message = message;
  }

  clear() {
    this.message = '';
  }
}
