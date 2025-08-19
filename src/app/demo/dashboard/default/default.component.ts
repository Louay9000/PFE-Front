// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Objective } from '../../models/Objective';
import { Status } from '../../models/Status';
import { ObjectiveService } from '../../services/objective-service';
import { Auth } from '../../services/auth';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../models/ChartOptions';
import { TaskService } from '../../services/task-service';
import { User } from '../../models/User';
import Swal from 'sweetalert2';
import { DepartmentService } from '../../services/department-service';
import { Okr } from '../../models/Okr';
import { Role } from '../../models/Role';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/Task';
import { Department } from '../../models/Department';
import { Image } from '../../models/Image';

@Component({
  selector: 'app-default',
  imports: [CommonModule,
  SharedModule, NgxPaginationModule,
  NgApexchartsModule,FormsModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
UpdateObjectivePopup: boolean = false;
AddObjectivePopup: boolean = false;


ObjectivesList : Objective [] = [];

public chartOptions: Partial<ChartOptions> | any;




Objective: Objective = {
id: null,
objectiveTitle: '',
objectiveDescription: '',
objectiveStatus: Status.UNREACHED, // Assuming Status is an enum or class with predefined values
objectiveScore: 0,
objectiveProgress: 0
}
okr : Okr = new Okr(null, '', '', 0, 0, 0, 0, null, null);
image : Image = new Image();
department : Department = new Department(null, '', '', null);
user: User = new User(null, '', '', '', '','', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN, this.department,this.image);

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

Auth=this.auth

taskStats: { [status: string]: number } = {};

TaskStatsByUser: { [status: string]: number } = {};

topUser: any;

tasksByDepartment: Task[] = [];

selecteddepartmentid: number;


constructor(private objectiveService: ObjectiveService
  ,public auth: Auth
, private taskService: TaskService,
private departmentService: DepartmentService,
) {
  }



  getAllObjectives() {
    this.objectiveService.getAllObjectives().subscribe((data: Objective[]) => {
      this.ObjectivesList = data;
    }, error => {
      console.error('Error fetching objectives:', error);
    });
  }


  AddObjective(objective: Objective) {
    this.objectiveService.AddObjective(objective).subscribe((data: Objective) => {
      // Optionally, refresh the list of objectives after adding a new one
      window.location.reload();
      console.log( data.objectiveStatus);
      objective.objectiveTitle = ''; // Clear the input field after adding
      this.Objective = {
        id: null,
        objectiveTitle: '',
        objectiveDescription: '',
        objectiveStatus: Status.UNREACHED, // Reset to default status
        objectiveScore: 0,
        objectiveProgress: 0

      }; // Reset the Objective object
    }, error => {
      console.error('Error adding objective:', error);
    });
  }

UpdateObjective(objective: Objective) {

    this.objectiveService.UpdateObjective(objective).subscribe((data: Objective) => {

      window.location.reload();
    }, error => {
      console.error('Error updating objective:', error);
    });
  }

  closeUpdateObjectivePopup():void {
    this.UpdateObjectivePopup = false;
    this.Objective = {
      id: null,
      objectiveTitle: '',
      objectiveDescription: '',
      objectiveStatus: Status.UNREACHED, // Reset to default status
      objectiveScore: 0,
      objectiveProgress: 0
    }
    }

  openUpdateObjectivePopup(objective:Objective): void {
    this.UpdateObjectivePopup = true;
    this.Objective = { ...objective };

  }

  openAddObjectivePopup(): void {
    this.AddObjectivePopup = true;
  }

  closeAddObjectivePopup(): void {
    this.AddObjectivePopup = false;
    this.Objective={
    id: null,
      objectiveTitle: '',
      objectiveDescription: '',
      objectiveStatus: Status.UNREACHED, // Reset to default status
      objectiveScore: 0,
      objectiveProgress: 0
    }
  }

DeleteObjective(objectiveId: Objective) {
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
        this.objectiveService.DeleteObjective(objectiveId).subscribe(() => {
          // Optionally, refresh the list of objectives after deletion
          window.location.reload();
          Swal.fire(
            'Deleted!',
            'Your objective has been deleted.',
            'success'
          );
        }, error => {
          console.error('Error deleting objective:', error);
          Swal.fire(
            'Error!',
            'You cannot delete the objective.',
            'error'
          );
        });
      }
    });
  }

  loadObjectiveStats() {
  this.objectiveService.getObjectivesCountByStatus().subscribe((stats: any) => {
    const labels = Object.keys(stats);
    const series = Object.values(stats);

    this.chartOptions = {
  series: series,
  chart: {
    width: 380,
    type: "pie"
  },
  labels: labels,
  colors: ['#66BB6A', '#42A5F5', '#EF5350'],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 320
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ]
};

  });
}



getTaskStats(): void {
  this.taskService.getTasksCountByStatus().subscribe(
    (stats: { [status: string]: number }) => {
      this.taskStats = stats;
    },
    error => {
      console.error('Erreur lors de la récupération des stats de tâches:', error);
    }
  );
}


MakeCardsChange(){
  const quotes = [
      {
        text: '"A goal well set is half achieved."',
        author: 'Abraham Lincoln '
      },
      {
        text: '"The future depends on what you do today."',
        author: 'Mahatma Gandhi'
      },
      {
        text: '"Genius is one percent inspiration and ninety-nine percent perspiration."',
        author: 'Thomas Edison'
      }
    ];

    let index = 0;
    const quoteText = document.getElementById("quote-text")!;
    const quoteAuthor = document.getElementById("quote-author")!;
    const quoteContainer = document.getElementById("quote-container")!;

    setInterval(() => {
      quoteContainer.classList.add("fade-out");

      setTimeout(() => {
        index = (index + 1) % quotes.length;
        quoteText.innerHTML = `${quotes[index].text} <i class="bi bi-arrow-up-right-circle opacity-50"></i>`;
        quoteAuthor.textContent = quotes[index].author;
        quoteContainer.classList.remove("fade-out");
      }, 1000);
    }, 5000);
  }

  GetTopUserWithReachedTasks() {
  this.taskService.getTopUserWithReachedTasks().subscribe(
  (user: any) => {
    this.topUser = user;
  },
  error => {
    console.error('Erreur lors de la récupération de l’utilisateur top', error);
  }
);
  }


  GetDepartmentIdByUserId(): void {
    this.departmentService.GetDepartmentIdByUserId(this.auth.userId).subscribe((data: number) =>
    {
      this.selecteddepartmentid = data;
      this.GetTasksByDepartment();
    },
      error => {
        console.error('Error fetching department:', error);
      }
    );
  }


  GetTasksByDepartment() {
    this.taskService.getTasksByDepartment(this.selecteddepartmentid).subscribe(
      (tasks: Task[]) => {
        this.tasksByDepartment = tasks;
      },
      error => {
        console.error('Erreur lors de la récupération des tâches par département', error);
      }
    );
  }

  getTaskStatusCountByUserId()
  {
    this.taskService.getTaskStatusCountByUserId(this.auth.userId).subscribe(
      (statusCount: { [status: string]: number }) => {
        this.TaskStatsByUser = statusCount;
      },
      error => {
        console.error('Error fetching task status count by user:', error);
      }
    );
  }

  get hasData(): boolean {
  return !!this.chartOptions?.series?.length && this.chartOptions.series.some(val => val > 0);
}



ngOnInit(): void {
  this.auth.loadProfile();
    this.getAllObjectives();
    this.loadObjectiveStats();
    this.getTaskStats();
    this.MakeCardsChange();
    this.GetTopUserWithReachedTasks();
    this.GetDepartmentIdByUserId()
    this.getTaskStatusCountByUserId();
}


}
