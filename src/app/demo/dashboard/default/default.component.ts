// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BajajChartComponent } from 'src/app/theme/shared/components/apexchart/bajaj-chart/bajaj-chart.component';
import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';
import { ChartDataMonthComponent } from 'src/app/theme/shared/components/apexchart/chart-data-month/chart-data-month.component';
import { Objective } from '../../models/Objective';
import { Status } from '../../models/Status';
import { ObjectiveService } from '../../services/objective-service';
import { Auth } from '../../services/auth';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-default',
  imports: [CommonModule, BajajChartComponent, BarChartComponent, ChartDataMonthComponent, SharedModule, NgxPaginationModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
UpdateObjectivePopup: boolean = false;
AddObjectivePopup: boolean = false;


ObjectivesList : Objective [] = [];
Objective: Objective = {
id: null,
objectiveTitle: '',
objectiveDescription: '',
objectiveStatus: Status.UNREACHED, // Assuming Status is an enum or class with predefined values
objectiveScore: 0,
objectiveProgress: 0
}
p:any;


constructor(private objectiveService: ObjectiveService,private auth: Auth) {
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
    this.objectiveService.DeleteObjective(objectiveId).subscribe(() => {
      window.location.reload();
    }, error => {
      console.error('Error deleting objective:', error);
    });
  }


ngOnInit(): void {
  this.auth.loadProfile();
    this.getAllObjectives();

}


  ListGroup = [
    {
      name: 'Bajaj Finery',
      profit: '10% Profit',
      invest: '$1839.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'TTML',
      profit: '10% Loss',
      invest: '$100.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Reliance',
      profit: '10% Profit',
      invest: '$200.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'ATGL',
      profit: '10% Loss',
      invest: '$189.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Stolon',
      profit: '10% Profit',
      invest: '$210.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success',
      space: 'pb-0'
    }
  ];

  profileCard = [
    {
      style: 'bg-primary-dark text-white',
      background: 'bg-primary',
      value: '$203k',
      text: 'Net Profit',
      color: 'text-white',
      value_color: 'text-white'
    },
    {
      background: 'bg-warning',
      avatar_background: 'bg-light-warning',
      value: '$550K',
      text: 'Total Revenue',
      color: 'text-warning'
    }
  ];
}
