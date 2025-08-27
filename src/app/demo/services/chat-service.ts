import { Injectable, OnDestroy } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/ChatMessage ';
import { Auth } from './auth';


@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

  private apiUrl = 'http://localhost:8085';

  constructor(private http: HttpClient,private auth:Auth) {}
  ngOnDestroy(): void {
 if (this.stompClient?.connected) {
    this.stompClient.deactivate();
  }  }
  private stompClient: Client | null = null;

  
  connect(username: string, onMessage: (msg: ChatMessage) => void) {
    if (this.stompClient?.connected) return; // déjà connecté
    this.stompClient = Stomp.over(() => new SockJS(`${this.apiUrl}/chat-ws`));
    this.stompClient.onConnect = () => {
      console.log(`Connected as ${username}`);
      // Subscribe to global topic
      this.stompClient?.subscribe('/topic/messages', (message: Message) => {
        const msg: ChatMessage = JSON.parse(message.body);
        // Filtrer pour ne recevoir que les messages qui concernent l'utilisateur
        if (msg.receiver.id === this.auth.userId || msg.sender.id === this.auth.userId) {
          onMessage(msg);
        }
      });
    };
    this.stompClient.activate();
  }

  sendMessage(msg: any) {
      if (this.stompClient && this.stompClient.connected) {
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(msg)
    });
  } else {
    console.error('WebSocket not connected yet!');
  }
    }

    // --- Ajouter message en BDD ---
  addMessage(senderId: number, receiverId: number, content: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(
      `${this.apiUrl}/talk/add`,
      null,
      {
        params: { senderId, receiverId, content }
      }
    );
  }
  // Récupérer la conversation entre deux utilisateurs
  getConversation(user1Id: number, user2Id: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/talk/conversation?user1=${user1Id}&user2=${user2Id}`);
  }

}
