// Angular import
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Department } from 'src/app/demo/models/Department';
import { User } from 'src/app/demo/models/User';
import { Image } from 'src/app/demo/models/Image';
import { Role } from 'src/app/demo/models/Role';
import { Auth } from 'src/app/demo/services/auth';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DepartmentService } from 'src/app/demo/services/department-service';
import { ImageService } from 'src/app/demo/services/image-service';
import { ChatMessage } from 'src/app/demo/models/ChatMessage ';
import { ChatService } from 'src/app/demo/services/chat-service';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {

department : Department = new Department(null, '', '', null);

selecteddepartmentid: number = null;

departmentName: string = '';

image : Image = new Image();


chatMessage: ChatMessage;
message:ChatMessage;
chatMessagesList: ChatMessage[] = [];
conversationMessages: ChatMessage[] = [];
chatMessagePopUp: boolean = false;
connected = false;


Auth = this.authService;
messageContent = ''

selectedUserToSendMessage: User = new User(0, '', '', '','', '',
  Role.EMPLOYEE || Role.MANAGER || Role.ADMIN
  ,this.department
  ,this.image);

selectedUserId: number;

myprofileuser: User = new User(null, '', '', '', '', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN,this.department,this.image);

images: Image[] = [];


  constructor(private authService: Auth,
    private departmentService: DepartmentService,
    private imageService: ImageService,
    private chatService: ChatService

  ) { }

  ngOnInit(): void {
  this.authService.loadProfile();
    this.myprofileuser.id = this.authService.userId;
    this.myprofileuser.firstname = this.authService.firstname;
    this.myprofileuser.lastname = this.authService.lastname;
    this.myprofileuser.username= this.authService.username;
    this.myprofileuser.role = this.authService.UserRole;
    this.GetDepartmentNameByUserId();
    this.GetImageIdByUserId();
    this.fetchImages();
    this.loadInboxMessages();
  }


  loadInboxMessages(): void {
    this.chatService.getMessagesForUser(this.myprofileuser.id).subscribe(
      (messages) => {
        this.chatMessagesList = messages;
      },
      (error) => {
        console.error('Error fetching inbox messages:', error);
      }
    );
  }


//affihcer Image Utilisateur
    getUserImage(user: User): Image | null {
      if (user.image && this.images) {
        return this.images.find(image => image.id === user.image.id) || null;
      }
      return null;
    }

     //affichage Image
    fetchImages(): void {
      this.imageService.list().subscribe(
        (images) => {
          this.images = images;
        },
        (error) => {
          console.error('Error fetching images:', error);
        }
      );
    }

GetDepartmentNameByUserId() {
  this.departmentService.GetDepartmentNameByUserId(this.myprofileuser.id).subscribe({
    next: (deptName: string) => {
    this.departmentName = deptName;
    },
    error: (err) => {
    console.error('Erreur lors de l’appel au backend :', err);
    }
    });
  }

  GetImageIdByUserId() {
    this.imageService.getImageIdByUserId(this.myprofileuser.id).subscribe({
      next: (imageId: number) => {
        if (imageId) {
          this.myprofileuser.image.id = imageId;
        } else {
          console.log('Aucune image trouvée pour cet utilisateur.');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'ID de l\'image :', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }





  connect() {
  if (!this.connected) {
    this.chatService.connect(this.authService.username,(msg) => {
      // ⚡ Filtrage : afficher seulement si le message est lié au user sélectionné
      if (
        this.chatMessagePopUp &&
        this.selectedUserToSendMessage &&
        ((msg.sender.id === this.selectedUserToSendMessage.id && msg.receiver.id === this.authService.userId) ||
        (msg.receiver.id === this.selectedUserToSendMessage.id && msg.sender.id === this.authService.userId))
      ) {
        this.conversationMessages.push(msg);
      }
    });
    this.connected = true;
  }
}

  openChat(user: User) {
  this.selectedUserToSendMessage = user;
  this.chatMessagePopUp = true;
  this.loadConversation(user);
  this.connect();
  }


sendMessage(receiver: User) {
    const senderId = this.authService.userId;
    const receiverId = receiver.id;
    const content = this.messageContent;
    this.chatService.addMessage(senderId, receiverId, content).subscribe((savedMsg) => {
      //this.conversationMessages.push(savedMsg); // update affichage
      this.chatService.sendMessage(savedMsg);
    });
    this.messageContent = '';
  }


  loadConversation(user: User) {
    this.chatService.getConversation(this.authService.userId, user.id)
      .subscribe(data => {
        this.conversationMessages = data;
        console.log(data);
      });
  }

    closeMessagesWithUser() {
    this.chatMessagePopUp = false;
  }

  getconversationMessages() {
  return this.chatMessagesList.filter(m =>
    (m.sender.id === this.Auth.userId && m.receiver.id === this.selectedUserId) ||
    (m.sender.id === this.selectedUserId && m.receiver.id === this.Auth.userId)
  );
}
closeChat() {
  this.chatMessagePopUp = false;
}

}
