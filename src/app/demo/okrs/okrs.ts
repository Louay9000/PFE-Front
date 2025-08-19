import { Component, OnInit } from '@angular/core';
import { Okr } from '../models/Okr';
import { OkrService } from '../services/okr-service';
import { Auth } from '../services/auth';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { Objective } from '../models/Objective';
import { Department } from '../models/Department';
import { DepartmentService } from '../services/department-service';
import { ObjectiveService } from '../services/objective-service';
import { Status } from '../models/Status';

@Component({
  selector: 'app-okrs',
  imports: [CommonModule, SharedModule,NgxPaginationModule],
  templateUrl: './okrs.html',
  styleUrl: './okrs.scss'
})
export class Okrs implements OnInit {
OkrsList : Okr [] = [];
ObjectivesList: Objective[] = [];
DepartmentsList: Department[] = [];

DepartmentsWithoutOkr: Department[] = [];

UpdateOkrPopup: boolean = false;
AddOkrPopup: boolean = false;


department : Department = new Department(null, '', '', null);
selecteddepartmentid: number = null;

objective : Objective = new Objective (null,'','',Status.UNREACHED,null,null); // Assuming Status is an enum or class with predefined values0,0);
selectedobjectiveid : number = null;

authService=this.auth;

Okr: Okr = {
  id: null,
  keyindicatorTitle: '',
  keyindicatorDescription: '',
  targetValue: 0,
  reachedValue: 0,
  okrWeight: 0,
  okrProgression: 0,
  department: this.department,
  objective: this.objective
};

p:any;


constructor(private okrService: OkrService,
  public auth: Auth,
  private departmentService: DepartmentService,
  private objectiveService:ObjectiveService
) {}


getDepartmentsWithoutOkr() {
  this.departmentService.GetDepartmentsWithoutOkr().subscribe((data: Department[]) => {
    this.DepartmentsWithoutOkr = data;
  }, error => {
    console.error('Error fetching departments without OKR:', error);
  });
}




  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe((data: Department[]) => {
      this.DepartmentsList = data;
    }, error => {
      console.error('Error fetching departments:', error);
    });
  }

  getAllObjectives(){
    this.objectiveService.getAllObjectives().subscribe((data:Objective[]) =>{
    this.ObjectivesList = data;
  } , error => {
    console.error('error fetching objectives', error);
  });
  }


  ngOnInit() {
    this.auth.loadProfile();
    this.getAllOkrs();
    this.getAllDepartments();
    this.getAllObjectives();
    this.getDepartmentsWithoutOkr();

  }

setWeight(okr: Okr, weight: number): void {
  okr.okrWeight = weight;
  this.selecteddepartmentid = okr.department?.id ;
  this.selectedobjectiveid = okr.objective?.id ;

  this.UpdateOkr(okr, this.selecteddepartmentid, this.selectedobjectiveid);
}

getStarClass(index: number, weight: number): string {
  return index < weight ? 'bi-star-fill text-warning' : 'bi-star text-secondary';
}



  getAllOkrs() {
    this.okrService.getAllokrs().subscribe((data: Okr[]) => {
      this.OkrsList = data;
    }, error => {
      console.error('Error fetching okrs:', error);
    });
  }

  isOkrTitleUnique(title: string): boolean {
    return !this.OkrsList.some(
      o => o.keyindicatorTitle.trim().toUpperCase() === title.trim().toUpperCase()
    );
  }


  AddOkr(okr: Okr,departmentId:number,objectiveId : number) {

    if (!this.isOkrTitleUnique(okr.keyindicatorTitle)) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate title',
        text: 'This key indicator title already exists (case not taken into account).',
        timer: 99999,
        timerProgressBar: true,
        showConfirmButton: false
      });

    }else{
  this.okrService.AddOkr(okr,departmentId,objectiveId).subscribe((data: Okr) => {

        window.location.reload();

        okr.keyindicatorTitle = ''; // Clear the input field after adding
        this.Okr = {
          id: null,
          keyindicatorTitle: '',
          keyindicatorDescription: '',
          targetValue: 0,
          reachedValue: 0,
          okrWeight: 0,
          okrProgression: 0,
          department:null,
          objective:null
        };
      }, error => {
        console.error('Error adding okr:', error);
      });
    }}

  UpdateOkr(okr: Okr, departmentId: number, objectiveId: number) {

      this.okrService.UpdateOkr(okr, departmentId, objectiveId).subscribe((data: Okr) => {
        window.location.reload();
      }, error => {
        console.error('Error updating okr:', error);
      });
    }

    closeUpdateOkrPopup():void {
      this.UpdateOkrPopup = false;
      this.Okr = {
        id: null,
        keyindicatorTitle: '',
        keyindicatorDescription: '',
        targetValue: 0,
        reachedValue: 0,
        okrWeight: 0,
        okrProgression: 0,
        department:null,
        objective:null

      }}

    openUpdateOkrPopup(okr:Okr): void {
      this.UpdateOkrPopup = true;
      this.selecteddepartmentid = okr.department?.id ;
      this.selectedobjectiveid = okr.objective?.id ;
      this.Okr = { ...okr };
    }

    openAddOkrPopup(): void {
      this.AddOkrPopup = true;
    }

    closeAddOkrPopup(): void {
      this.AddOkrPopup = false;
      this.Okr = {
        id: null,
        keyindicatorTitle: '',
        keyindicatorDescription: '',
        targetValue: 0,
        reachedValue: 0,
        okrWeight: 0,
        okrProgression: 0,
        department:null,
        objective:null
      };
    }



DeleteOkr(okr: Okr) {
  Swal.fire({
    title: 'Are you sure?',
    text: "This action will permanently delete this OKR.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.okrService.DeleteOkr(okr).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted !',
          text: 'The OKR has been successfully deleted.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.OkrsList = this.OkrsList.filter(item => item.id !== okr.id); //window.location.reload();
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting the OKR.',
        });
        console.error('Error deleting okr:', error);
      });
    }
  });
}


}



