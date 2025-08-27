import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat-service';
import { Auth } from '../services/auth';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {
  ngOnInit() {
    this.connect();
  }

  constructor(private chatService: ChatService,private auth : Auth) {}

  toUser = '';
  messageContent = '';
  messages: any[] = [];
  connected = false;
  authService: Auth;
  username:string= this.auth.username;


  connect() {
    if (this.auth.username.trim()) {
      this.chatService.connect(this.auth.username, (msg) => {
        this.messages.push(msg);
      });
      this.connected = true;
    }
  }

  sendMessage() {
    if (this.messageContent.trim() && this.toUser.trim()) {
    //  this.chatService.sendMessage(this.auth.username, this.toUser, this.messageContent);
      this.messages.push({ from: this.auth.username, to: this.toUser, content: this.messageContent });
      this.messageContent = '';
    }
  }

}

