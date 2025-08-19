import { i } from '@angular/cdk/data-source.d-Bblv7Zvh';
import { Component, OnInit } from '@angular/core';
import { Task } from '../models/Task';
import { TaskService } from '../services/task-service';
import { Auth } from '../services/auth';
import { Status } from '../models/Status';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Okr } from '../models/Okr';
import { User } from '../models/User';
import { Role } from '../models/Role';
import {Image} from '../models/Image';
import { Department } from '../models/Department';
import { OkrService } from '../services/okr-service';
import { DepartmentService } from '../services/department-service';
import { Emailservice } from '../services/emailservice';
import { catchError, of, switchMap } from 'rxjs';
import { ExportService } from '../services/export-service';
import { MlService, TaskProbabilities } from '../services/ml-service';



@Component({
  selector: 'app-tasks',
  imports: [CommonModule, SharedModule,NgxPaginationModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks implements OnInit {


TasksList : Task [] = [];
searchText: string = '';
noTasksOrSearch: any;


UsersList: User[] = [];
OkrsList: Okr[] = [];


UpdateTaskPopup: boolean = false;
AddTaskPopup: boolean = false;


okr : Okr = new Okr(null, '', '', 0, 0, 0, 0, null, null);
selectedokrid: number = null;

department : Department = new Department(null, '', '', null);
selecteddepartmentid: number ;

image : Image = new Image();

user: User = new User(null, '', '', '', '','', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN, this.department,this.image);
selecteduserid: number = null;


Task: Task = {
  id:null,
  taskTitle: '',
  taskDescription: '',
  taskState:null,
  taskStartValue: 0,
  taskDoneValue: 0,
  taskWeight: 0,
  okr: this.okr,
  user:this.user
};

p:any;

Auth=this.auth;

probabilities: TaskProbabilities | null = null;



constructor(private taskService: TaskService,
  private auth: Auth,
  private okrService: OkrService,
  private departmentService: DepartmentService,
  private emailService: Emailservice,
  private exportSrv: ExportService,
  private mlService: MlService
) { }

  ngOnInit() {
    this.auth.loadProfile();
    this.getAllTasks();
    this.getAllokrs();
    this.getAllUsers();
    this.loadTasksWithProbabilities();
  }


  loadTasksWithProbabilities() {
  this.taskService.getAllTasks(this.auth.UserRole, this.auth.userId).subscribe({
    next: (tasks: Task[]) => {
      this.TasksList = tasks;

      // Affichage debug pour vérifier les inputs ML
      this.TasksList.forEach(task => {
        console.log('Input ML:', task.taskWeight, task.taskStartValue, task.taskDoneValue);
        console.log('Input ML:', task.taskWeight, task.taskStartValue, task.taskDoneValue);

        this.mlService.getTaskProbabilities({
          taskWeight: task.taskWeight,
          taskStartValue: task.taskStartValue,
          taskDoneValue: task.taskDoneValue
        }).subscribe({
          next: (proba: TaskProbabilities) => {
            console.log('Proba ML:', proba);
            task.proba_REACHED = proba.proba_REACHED;
            task.proba_INPROGRESS = proba.proba_INPROGRESS;
            task.proba_UNREACHED = proba.proba_UNREACHED;
          },
          error: err => console.error('Erreur ML:', err)
        });
      });
    },
    error: err => console.error('Erreur Tasks:', err)
  });
}



  getAllUsers() {
    this.auth.getAllUsers(this.auth.UserRole, this.auth.userId).subscribe((data: User[]) => {
      this.UsersList = data.filter(user => user.id !== this.auth.userId);
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  GetDepartmentIdByUserId(userId: number): void {
    this.departmentService.GetDepartmentIdByUserId(userId).subscribe((data: number) =>
    {
      this.selecteddepartmentid = data;
    },
      error => {
        console.error('Error fetching department:', error);
      }
    );
  }

  getAllokrs() {
  this.departmentService.GetDepartmentIdByUserId(this.auth.userId).subscribe(
    (departmentId: number) => {
      this.selecteddepartmentid = departmentId;

      // Appeler getOkrsByDepartmentId uniquement après avoir obtenu l'ID
      this.okrService.getOkrsByDepartmentId(this.selecteddepartmentid).subscribe(
        (okrs: Okr[]) => {
          this.OkrsList = okrs;
        },
        error => {
          console.error('Error fetching okrs:', error);
        }
      );
    },
    error => {
      console.error('Error fetching department id:', error);
    }
  );
}



  setWeight(task: Task, weight: number): void {
    task.taskWeight = weight;
    this.selectedokrid = task.okr.id;
    this.selecteduserid = task.user.id;
    this.UpdateTask(task, this.selectedokrid, this.selecteduserid);
  }

  getStarClass(index: number, weight: number): string {
  return index < weight ? 'bi-star-fill text-warning' : 'bi-star text-secondary';
}

  getAllTasks() {
    this.taskService.getAllTasks(this.auth.UserRole, this.auth.userId).subscribe((data: Task[]) => {
      this.TasksList = data;
    }, error => {
      console.error('Error fetching tasks:', error);
    });
  }

  isTaskTitleUnique(taskTitle: string): boolean {
    return !this.TasksList.some(
      t => t.taskTitle.trim().toUpperCase() === taskTitle.trim().toUpperCase()
    );
  }

  AddTask(task: Task, okrId: number, userId: number) {
  if (!this.isTaskTitleUnique(task.taskTitle)) {
    Swal.fire({
      icon: 'warning',
      title: 'Duplicate title',
      text: 'This task already exists (case not taken into account).',
      timer: 99999,
      timerProgressBar: true,
      showConfirmButton: false
    });
    return; // On sort pour éviter la suite
  }

  this.taskService.AddTask(task, okrId, userId).pipe(
    //switchMap(() => this.auth.GetEmailByUserId(userId)),
    //switchMap(email => this.emailService.sendEmail(email, 'New Task Assigned', `You have been assigned a new task: ${task.taskTitle}`)),
    catchError(error => {
      console.error('Error adding task or sending email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Task added but failed to send email.'
      });
      return of(null); // Continue le flux même en cas d'erreur
    })
  ).subscribe(() => {
    Swal.fire({
      icon: 'success',
      title: 'Task Added',
      text: 'Task added successfully and email sent!'
    });
    //fermer le pop up de l'ajout de tâche
    this.closeAddTaskPopop();
    // Mettre à jour la liste localement sans recharger la page
    window.location.reload();

    // Réinitialiser le formulaire
    this.Task = {
      id: null,
      taskTitle: '',
      taskDescription: '',
      taskState: null,
      taskStartValue: 0,
      taskDoneValue: 0,
      taskWeight: 0,
      okr: null,
      user: null
    };
  });
}

  UpdateTask(task: Task, okrId: number, userId: number): void {
  this.taskService.UpdateTask(task, okrId, userId).subscribe({
    next: (updatedTask: Task) => {
      // Rappeler le ML service pour recalculer les probabilités
      this.mlService.getTaskProbabilities({
        taskWeight: updatedTask.taskWeight,
        taskStartValue: updatedTask.taskStartValue,
        taskDoneValue: updatedTask.taskDoneValue
      }).subscribe({
        next: (proba: TaskProbabilities) => {
          updatedTask.proba_REACHED = proba.proba_REACHED;
          updatedTask.proba_INPROGRESS = proba.proba_INPROGRESS;
          updatedTask.proba_UNREACHED = proba.proba_UNREACHED;

          // Mettre à jour la tâche dans la liste locale
          const index = this.TasksList.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) this.TasksList[index] = updatedTask;

          // Puis recharger la page si vraiment nécessaire
          window.location.reload();
        },
        error: err => {
          console.error('Erreur ML:', err);
          window.location.reload(); // au moins recharger même si ML échoue
        }
      });
    },
    error: err => console.error('Error updating Task:', err)
  });
}


  closeUpdateTaskPopup(): void {
    this.UpdateTaskPopup = false;
    this.Task = {
      id: null,
      taskTitle: '',
      taskDescription: '',
      taskState: null,
      taskStartValue: 0,
      taskDoneValue: 0,
      taskWeight: 0,
      okr: null,
      user: null
    };
  }

  openUpdateTaskPopup(task: Task): void {
    this.UpdateTaskPopup = true;
    this.selectedokrid = task.okr?.id;
    this.selecteduserid = task.user?.id;
    this.Task = { ...task }; // Create a copy of the task to edit
  }

  openAddTaskPopop(): void {
    this.AddTaskPopup = true;
    this.Task.taskState = Status.UNREACHED;
  }

  closeAddTaskPopop(): void {
    this.AddTaskPopup = false;
    this.Task = {
      id: null,
      taskTitle: '',
      taskDescription: '',
      taskState: null,
      taskStartValue: 0,
      taskDoneValue: 0,
      taskWeight: 0,
      okr: null,
      user: null
    };
}

DeleteTask(task: Task): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.taskService.DeleteTask(task).subscribe(() => {
        window.location.reload();
      }, error => {
        console.error('Error deleting Task:', error);
      });
    }
  });
}

filteredTasks(tasks: any[], search: string): any[] {
  if (!search || !search.trim()) return [];
  const term = search.toLowerCase().trim();
  return tasks.filter(task =>
    task.user.username.toLowerCase().includes(term)
  );
}

downloadCsv() {
  this.exportSrv.downloadTasksCsv().subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}


}
