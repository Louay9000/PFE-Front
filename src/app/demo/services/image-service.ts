import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../models/Image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

imageURL = 'http://localhost:8085/';

constructor(private httpclient: HttpClient) { }

public list(): Observable<Image[]> {
  return this.httpclient.get<Image[]>(this.imageURL + `cloudinary/list`);
}

public UploadAndAffectImageToUser(userId:number,image: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', image);
  return this.httpclient.post(`${this.imageURL}${userId}/upload-image`, formData, {
    responseType: 'text' // ✅ Ajoute ceci
  });
}

public delete(id: any): Observable<any> {
  return this.httpclient.delete<any>(this.imageURL + `delete/${id}`);
}

// image.service.ts
getAllImages(): Observable<Image[]> {
  return this.httpclient.get<Image[]>('http://localhost:8085/cloudinary/list');
}

getImageIdByUserId(userId: number): Observable<number> {
  return this.httpclient.get<number>(`${this.imageURL}${userId}/image-id`);
}

}
