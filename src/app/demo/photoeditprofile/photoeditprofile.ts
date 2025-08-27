import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { Role } from '../models/Role';
import { DepartmentService } from '../services/department-service';
import { Auth } from '../services/auth';
import { ImageService } from '../services/image-service';
import {Image} from '../models/Image';
import { Router } from '@angular/router';


@Component({
  selector: 'app-photoeditprofile',
  imports: [CommonModule],
  templateUrl: './photoeditprofile.html',
  styleUrl: './photoeditprofile.scss'
})
export class Photoeditprofile implements OnInit {

department : Department = new Department(null, '', '', null);
selecteddepartmentid: number = null;

departmentName: string = '';

image : Image = new Image();

myprofileuser: User = new User(null, '', '', '','', '', Role.EMPLOYEE || Role.MANAGER || Role.ADMIN,this.department,this.image);
myprofileuserEmail: string = '';

images: Image[] = [];

imageLoader : Boolean = false;

selectedImageFile: File | null = null;
imagePreview: string | ArrayBuffer | null = null;

constructor(private departmentService : DepartmentService ,
  private authService: Auth,
  private imageService : ImageService,
) {}


  ngOnInit(): void {
    this.authService.loadProfile();
    this.myprofileuser.id = this.authService.userId;
    this.myprofileuser.firstname = this.authService.firstname;
    this.myprofileuser.lastname = this.authService.lastname;
    this.myprofileuser.username= this.authService.username;
    this.myprofileuser.role = this.authService.UserRole;
    this.getEmailByUserId();
    this.GetDepartmentNameByUserId();
    this.GetImageIdByUserId();
    this.fetchImages();
  }

getEmailByUserId() {
  this.authService.GetEmailByUserId(this.authService.userId).subscribe({
    next: (email) => {
      this.myprofileuserEmail = email;
    },

    error: (err) => {
      console.error('Erreur lors de la récupération de l\'email :', err);
    }
  });
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

triggerFileInput() {
  const fileInput = document.getElementById('imageInput') as HTMLElement;
  fileInput.click();
}

onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  this.selectedImageFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result;
  };
  reader.readAsDataURL(file);
}


uploadUserImage() {
  if (!this.selectedImageFile) {
    alert('Aucune image sélectionnée');
    return;
  }

  this.imageService.UploadAndAffectImageToUser(this.myprofileuser.id, this.selectedImageFile).subscribe({
    next: (res) => {
      this.startImageLoader(); //imageloader = true
      //arrêter le chargement de l'image après 4 secondes
      setTimeout(() => {
        this.stopImageLoader(); //imageloader = false
      }, 5500);
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      // Par exemple, rediriger ou recharger le profil
    },
    error: (err) => {
      console.error('Erreur lors de l\'upload:', err);
      alert('Erreur lors de l\'upload de l\'image');
    }
  });
}


GetDepartmentNameByUserId() {
  this.departmentService.GetDepartmentNameByUserId(this.myprofileuser.id).subscribe({
    next: (deptName: string) => {
    this.departmentName = deptName;
    },
    error: (err) => {
    
    this.departmentName = 'No Department assigned Due to Admin Role'
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

  startImageLoader() {
    this.imageLoader = true;
  }

  stopImageLoader() {
    this.imageLoader = false;
  }



}


