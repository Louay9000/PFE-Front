import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth';
import { TaskService } from '../services/task-service';
import { Task } from '../models/Task';
import { Okr } from '../models/Okr';
import { Image } from '../models/Image';
import { Department } from '../models/Department';
import { User } from '../models/User';
import { Role } from '../models/Role';
import Swal from 'sweetalert2';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Status } from '../models/Status';
import { MlService } from '../services/ml-service';

@Component({
  selector: 'app-employeetasks',
  imports: [CommonModule, SharedModule, NgxPaginationModule],
  templateUrl: './employeetasks.html',
  styleUrl: './employeetasks.scss'
})


export class Employeetasks implements OnInit {

  constructor(private auth: Auth,
              private taskService: TaskService,
              private mlService: MlService
  ) {}

okr : Okr = new Okr(null, '', '', 0, 0, 0, 0, null, null);
selectedokrid: number = null;

department : Department = new Department(null, '', '', null);

image : Image = new Image();

user: User = new User(null, '', '', '', '','', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN, this.department,this.image);
selecteduserid: number = null;

p:any;

TasksLists: Task[] = [];

task: Task = {
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



  ngOnInit() {
    this.auth.loadProfile();
    this.getTasksByUserId(this.auth.userId);
  
  };

loadTasksWithDurations() {
  this.TasksLists.forEach(task => {
    this.mlService.predictDuration({
      taskWeight: task.taskWeight,
      taskStartValue: task.taskStartValue,
      taskDoneValue: task.taskDoneValue
    }).subscribe({
      next: (res: any) => {
        task.predictedDuration = res.taskDuration;
        console.log('Durée ML:', task.predictedDuration);
      },
      error: err => console.error('Erreur ML duration:', err)
    });
  });
}





  getStarClass(index: number, weight: number): string {
  return index < weight ? 'bi bi-star-fill text-warning' : 'bi bi-star star-empty';
}


  getTasksByUserId(userId: number) {
    this.auth.GetTaskByUserId(userId).subscribe({
      next: (data: any) => {
        this.TasksLists = data; // Assuming the response is a list of tasks
        this.loadTasksWithDurations();
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


  markTaskInProgress(task: Task): void {
  task.taskState = Status.INPROGRESS;
  this.taskService.UpdateTask(task, task.okr.id, task.user.id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Mise à jour réussie',
        text: 'La tâche est maintenant en cours.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.error || 'Erreur lors de la mise à jour.',
      });
    }
  });
}

markTaskReached(task: Task): void {
  task.taskState = Status.REACHED;
  this.taskService.UpdateTask(task, task.okr.id, task.user.id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'La tâche est maintenant atteinte.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.error || 'Erreur lors de la mise à jour.',
      });
    }
  });
}





  }






