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



myprofileuser: User = new User(null, '', '', '', '', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN,this.department,this.image);

images: Image[] = [];


  constructor(private authService: Auth,
    private departmentService: DepartmentService,
    private imageService: ImageService
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
}
