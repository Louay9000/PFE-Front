import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth';
import { User } from '../models/User';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import { Role } from '../models/Role';
import { Route } from '@angular/router';
import { Department } from '../models/Department';
import { DepartmentService } from '../services/department-service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { Task } from '../models/Task';
import { Image } from '../models/Image';
import { ImageService } from '../services/image-service';
import { TaskService } from '../services/task-service';
import { Okr } from '../models/Okr';
import { OkrService } from '../services/okr-service';
import { Emailservice } from '../services/emailservice';



@Component({
  selector: 'app-users',
  imports: [CommonModule, SharedModule, NgxPaginationModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {
ListDeparments: Department[] = [];
TasksList:Task[] = [];

UpdateUserPopup: boolean = false;
AddUserPopup: boolean = false;
CheckTasksByUserIdPopUp: boolean = false;
AssignTaskPopup: boolean = false;

department : Department = new Department(null, '', '', null);
selecteddepartmentid: number = null;

image : Image = new Image();
images: Image[] = [];


okr : Okr = new Okr(null, '', '', 0, 0, 0, 0, null, null);
selectedokrid: number = null;



User: User = new User(null, '', '', '','', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN,this.department,this.image); // ou Role.ADMIN / Role.MANAGER
UsersList: User[] = [];
selectedUser: User = new User(0, '', '', '','', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN,this.department,this.image);

Task: Task = {
  id:null,
  taskTitle: '',
  taskDescription: '',
  taskState:null,
  taskStartValue: 0,
  taskDoneValue: 0,
  taskWeight: 0,
  okr: this.okr,
  user: this.User

};


selectedUserIdInTaskPopUp: number;
selecteddepartmentIdInTaskPopUp: number ;

p:any;

Auth = this.authService;


  constructor(private departmentService : DepartmentService ,
    private authService: Auth,
    private imageService: ImageService,
    private taskService: TaskService,
    private okrService: OkrService,
    private emailService:Emailservice) {}


  ngOnInit() {
    this.authService.loadProfile();
    this.getAllUsers();
    this.getAllDepartments();
    this.fetchImages();
  }

getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe((data: Department[]) => {
      this.ListDeparments = data;
    }, error => {
      console.error('Error fetching departments:', error);
    });
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

    getUserImage(user: User): Image | null {
      if (user.image && this.images) {
        return this.images.find(image => image.id === user.image.id) || null;
      }
      return null;
    }




  getAllUsers() {
  this.authService.getAllUsers(this.authService.UserRole, this.authService.userId)
    .subscribe(
      (data: User[]) => {
        this.UsersList = data.filter(user => user.id !== this.authService.userId);

      },
      (error) => {
        console.error('Error fetching users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Failed to fetch users. Please try again later.',
          timer: 3000,
          showConfirmButton: false
        });
      }
    );
}



    compareDepartments(d1: Department, d2: Department): boolean {
  return d1 && d2 ? d1.id === d2.id : d1 === d2;
}


    closeUpdateUserPopup():void {
    this.UpdateUserPopup = false;

    }

  openUpdateUseropup(user:User): void {
    this.UpdateUserPopup = true;
    this.selecteddepartmentid=user.department?.id;
    this.User = { ...user };
  }

  openAddUserPopup(): void {
    this.User = new User(null, '', '', '', '', '', Role.EMPLOYEE, this.department,this.image); // Réinitialiser le formulaire
    this.AddUserPopup = true;
  }

  closeAddUserPopup(): void {
    this.AddUserPopup = false;}


isUsernameUnique(Username: string): boolean {
  return !this.UsersList.some(
    u => u.username.trim().toUpperCase() === Username.trim().toUpperCase()
  );
}




  AddUser(user: User, departmentId: number) {
  this.selecteddepartmentid = departmentId;

  // ✅ Vérification de l'unicité du nom d'utilisateur
  if (!this.isUsernameUnique(user.username)) {
    Swal.fire({
      icon: 'warning',
      title: 'Duplicate username',
      text: 'This username already exists (case not sensitive).',
      timer: 99999,
      showConfirmButton: false
    });
    return;
  }else {
    this.authService.AddUser(user, departmentId).subscribe({
    next: (data: User) => {
      // ✅ Affichage de succès
      Swal.fire({
        icon: 'success',
        title: 'User added successfully',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.reload();
      });

      // ✅ Réinitialiser le formulaire
      this.User = new User(null, '', '', '', '','', Role.EMPLOYEE, this.department,this.image);


    },

    error: (error) => {
  const msg = error.error || 'Une erreur est survenue.';

  if (msg.includes('manager')) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur Manager',
      text: msg,
      timer: 3000,
      showConfirmButton: false
    });
  } else if (msg.includes('capacité')) {
    Swal.fire({
      icon: 'error',
      title: 'Capacity Error',
      text: msg,
      timer: 3000,
      showConfirmButton: false
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: msg,
      timer: 3000,
      showConfirmButton: false
    });
  }

  console.error('Error adding user:', error);
}
  });
  }


}

  deleteUser(userId: User) {
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'yes',
    cancelButtonText: 'no'
  }).then((result) => {
    if (result.isConfirmed) {
      this.authService.DeleteUser(userId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'User deleted successfully',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.getAllUsers(); // 🔁 Recharge dynamiquement la liste
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.error || 'Error while deleting.',
            timer: 3000,
            showConfirmButton: false
          });
          console.error('Error deleting user:', error);
        }
      });
    }

  }
  );
  }



UpdateUser(user: User) {
  this.authService.updateUserDTO(user).subscribe({
    next: (data: User) => {
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur mis à jour avec succès',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.getAllUsers(); // Refresh
        this.UpdateUserPopup = false;
        this.User = new User(null, '', '', '', '', '', Role.EMPLOYEE, this.department,this.image); // Reset form
      });
    },
    error: (error) => {
      const backendMessage = error?.error?.message || error?.error || 'Erreur lors de la mise à jour.';

      // Affichage conditionnel selon le type d’erreur
      if (backendMessage.includes('plein')) {
        Swal.fire({
          icon: 'warning',
          title: 'Département plein',
          text: backendMessage,
          confirmButtonText: 'OK'
        });
      } else if (backendMessage.includes('promouvoir') || backendMessage.includes('manager')) {
        Swal.fire({
          icon: 'error',
          title: 'Promotion refusée',
          text: backendMessage,
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: backendMessage,
          confirmButtonText: 'OK'
        });
      }

      console.error('Erreur mise à jour utilisateur:', error);
    }
  });
}


getTasksByUserId(user:User) {
  this.authService.GetTaskByUserId(user.id).subscribe({
    next: (data: any) => {
      this.TasksList = data;
      this.CheckTasksByUserIdPopUp = true;
      this.selectedUserIdInTaskPopUp = user.id;
      this.selecteddepartmentIdInTaskPopUp=user.department.id;
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.error || 'Error while fetching tasks.',
        timer: 3000,
        showConfirmButton: false
      });
      console.error('Error fetching tasks by user ID:', error);
    }
  });
}

openCheckTasksByUserIdPopUp(user: User): void {
  this.CheckTasksByUserIdPopUp = true;
  this.getTasksByUserId(user);
}

closeCheckTasksByUserIdPopUp(): void {
  this.CheckTasksByUserIdPopUp = false;
  this.TasksList = []; // Clear the list when closing the popup
  this.selectedUser = new User(0, '', '', '','', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN, this.department,this.image); // Reset selected user
  this.selecteddepartmentid = null; // Reset selected department ID
  this.User = new User(null, '', '', '','', '', Role.EMPLOYEE, this.department,this.image); // Reset user form

}

openAssignTaskPopup(departmentId : number , userId: number): void {
this.selectedUserIdInTaskPopUp = userId;
this.selecteddepartmentIdInTaskPopUp = departmentId;
this.AssignTaskPopup = true;
}
closeAssignTaskPopup(): void {
  this.AssignTaskPopup = false;
  this.User = new User(null, '', '', '','', '', Role.EMPLOYEE, this.department,this.image); // Reset user form
}

assignTaskToUser(task: Task, departmentId: number, userId: number): void {
  console.log(departmentId, userId);
  this.taskService.createTaskAndAssign(task, departmentId, userId).subscribe({
    next: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Tâche assignée avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      this.authService.GetEmailByUserId(userId).subscribe(email => {
        this.emailService.sendEmail(email, task.taskTitle, task.taskDescription).subscribe();
      });
      this.AssignTaskPopup = false;
      this.CheckTasksByUserIdPopUp=true;
      this.getTasksByUserId(this.UsersList.find(u => u.id === userId));
      this.Task = {
      id: null,
      taskTitle: '',
      taskDescription: '',
      taskState: null,
      taskStartValue: 0,
      taskDoneValue: 0,
      taskWeight: 0,
      okr: this.okr,
      user: this.User
      };

    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.error || 'Department Without an Okr ',
        timer: 3000,
        showConfirmButton: false
      });
      console.error('Error assigning task:', error);
    }
  });
}


}

