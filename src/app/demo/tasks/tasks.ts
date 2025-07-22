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
import { Department } from '../models/Department';
import { OkrService } from '../services/okr-service';



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

user: User = new User(null, '', '', '', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN, this.department);
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

constructor(private taskService: TaskService, private auth: Auth,private okrService: OkrService) { }

  ngOnInit() {
    this.auth.loadProfile();
    this.getAllTasks();
    this.getAllokrs();
    this.getAllUsers();
  }

  getAllUsers() {
    this.auth.getAllUsers().subscribe((data: User[]) => {
      this.UsersList = data;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
  getAllokrs() {
    this.okrService.getAllokrs().subscribe((data: Okr[]) => {
      this.OkrsList = data;
    }, error => {
      console.error('Error fetching okrs:', error);
    });
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
    this.taskService.getAllTasks().subscribe((data: Task[]) => {
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

  AddTask(task:Task,okrId: number, userId: number) {
    if (!this.isTaskTitleUnique(task.taskTitle)) {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate title',
            text: 'This task already exists (case not taken into account).',
            timer: 99999,
            timerProgressBar: true,
            showConfirmButton: false
          });

        }
        else{
          this.taskService.AddTask(task, okrId, userId).subscribe((data: Task) => {
                  window.location.reload();
                  task.taskTitle = ''; // Clear the input field after adding
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
                }, error => {
                  console.error('Error adding Task:', error);
                });
        }
  }

  UpdateTask(task: Task,okrId: number, userId: number): void {
    this.taskService.UpdateTask(task,okrId,userId).subscribe((data: Task) => {
      window.location.reload();
    }, error => {
      console.error('Error updating Task:', error);
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






}
