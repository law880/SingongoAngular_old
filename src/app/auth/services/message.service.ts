import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Map<string, string> = new Map<string, string>(); // component to message
  add(message: string, component: string) {
    if (!this.messages.has(component)) {
      this.messages.set(component, message);
    } else {
      return 'Component already contains a message';
    }
  }

  delete(component: string) {
    this.messages.delete(component);
  }

  getMessage(component: string): string {
    console.log(this.messages.get(component))
    return this.messages.get(component);
  }

  hasMessage(component: string): boolean {
    return this.messages.has(component);
  }
}
