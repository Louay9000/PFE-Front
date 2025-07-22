import { Component, OnInit } from '@angular/core';
import { Department } from '../models/Department';
import { Auth } from '../services/auth';
import { DepartmentService } from '../services/department-service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-departments',
  imports: [CommonModule, SharedModule, NgxPaginationModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss'
})
export class Departments implements OnInit {
UpdateDepartmentPopup: boolean = false;
AddDepartmentPopup: boolean = false;
ShowDepartmentswithoutManagerPopup: boolean = false;
OpenAssignManagerPopup: boolean = false;

  DepartmentsList : Department [];
  ListDepartmentWithNoManager : Department[] = [];
  ListEmployeesByDepartment: User[] = [];

  Department: Department = {
    id: null,
    departmentName: '',
    departmentDescription: '',
    departmentCapacity: 0,
  }

ManagerRole : Role.MANAGER;
p:any;
p1:any;

  constructor (private departmentService: DepartmentService,private auth: Auth) {}

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe((data: Department[]) => {
      this.DepartmentsList = data;
    }, error => {
      console.error('Error fetching departments:', error);
    });
  }


  isDepartmentNameUnique(name: string): boolean {
  return !this.DepartmentsList.some(
    d => d.departmentName.trim().toUpperCase() === name.trim().toUpperCase()
  );
}

  AddDepartment(department: Department) {
  if (!this.isDepartmentNameUnique(department.departmentName)) {
    Swal.fire({
  icon: 'warning',
  title: 'Duplicate name',
  text: 'This department name already exists (case not taken into account).',
  timer: 99999,
  timerProgressBar: true,
  showConfirmButton: false
});
  } else{
    department.departmentName = department.departmentName.toUpperCase();

  this.departmentService.AddDepartment(department).subscribe((data: Department) => {
    window.location.reload();
    this.Department = {
      id: null,
      departmentName: '',
      departmentDescription: '',
      departmentCapacity: 0
    };
  }, error => {
    console.error('Error adding department:', error);
  });}

}

UpdateDepartment(department: Department) {

    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir mettre à jour ce département ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        department.departmentName = department.departmentName.toUpperCase();
        this.departmentService.UpdateDepartment(department).subscribe((data: Department) => {
          Swal.fire({
            icon: 'success',
            title: 'Département mis à jour avec succès',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.getAllDepartments(); // Rafraîchit la liste dynamiquement
          });
          this.closeUpdateDepartmentPopup();
        }, error => {
          console.error('Error updating department:', error);
        });
      }
    }
    );

}
  closeUpdateDepartmentPopup():void {
    this.UpdateDepartmentPopup = false;
    this.Department = {
      id: null,
      departmentName: '',
      departmentDescription: '',
      departmentCapacity: 0
    };
    }

  openUpdateDepartmentopup(department:Department): void {
    this.UpdateDepartmentPopup = true;
    this.Department = { ...department };
  }

  openAddDepartmentPopup(): void {
    this.AddDepartmentPopup = true;
  }

  closeAddDepartmentopup(): void {
    this.AddDepartmentPopup = false;
  }

  closeShowDepartmentswithoutManagerPopup(): void {
    this.ShowDepartmentswithoutManagerPopup = false;
  }
  openShowDepartmentswithoutManagerPopup(): void {
    this.ShowDepartmentswithoutManagerPopup = true;
    this.departmentService.getDepartmentsWithoutManager().subscribe((data: Department[]) => {
      this.ListDepartmentWithNoManager = data;
    }, error => {
      console.error('Error fetching departments without manager:', error);
    });
  }


  ngOnInit() {
    this.auth.loadProfile();
    this.getAllDepartments();
  }

DeleteDepartment(department: Department) {
  this.departmentService.DeleteDepartment(department).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Department deleted successfully',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.getAllDepartments(); // Rafraîchit la liste dynamiquement
      });
    },
    error: (error) => {
      console.error('Erreur backend :', error);

      const msg = error.error?.message || error.error || 'An error occurred while deleting the department.';

      Swal.fire({
        icon: 'error',
        title: 'Delete impossible',
        text: msg,
        timer: 3000,
        showConfirmButton: false
      });

    }
  });
}

openAssignManagerPopUp(department: Department) {
  this.OpenAssignManagerPopup = true;
  console.log(department.id)
  this.closeShowDepartmentswithoutManagerPopup();
  //get all users by department without manager
  this.departmentService.GetEmployeesByDepartment(department).subscribe((data: User[]) => {
    this.ListEmployeesByDepartment = data;
    console.log(this.ListEmployeesByDepartment);
  }, error => {
    console.error('Error fetching employees without manager:', error);
  });
}

closeAssignManagerPopUp(){
  this.OpenAssignManagerPopup = false;
  this.Department.id = null;
}

assignEmployeeAsManager(employee: User) {
  console.log(employee.id);
  console.log(employee.role);
    employee.role = Role.MANAGER;
    console.log(employee.role);

    this.auth.UpdateUserRole(employee).subscribe({
      next: (data: User) => {
        Swal.fire({
          icon: 'success',
          title: 'Manager assigned successfully',
          text: `Employee ${data.username} is now a manager.`,
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          this.closeAssignManagerPopUp();
          this.openShowDepartmentswithoutManagerPopup(); // Refresh the department list
        });
      },

      error: (error) => {
        console.error('Error assigning employee as manager:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error assigning manager',
          text: error.error?.message || 'An error occurred while assigning the manager.',
          timer: 3000,
          showConfirmButton: false
        });
      }
    });
  }}



