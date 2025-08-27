import { Injectable } from '@angular/core';
import { Meeting } from '../models/Meeting';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

private meetings: Meeting[] = [];
  private meetings$ = new BehaviorSubject<Meeting[]>(this.meetings);
  private apiUrl = 'http://localhost:8085/meetings';

  constructor(private http: HttpClient) {}

 // Récupérer toutes les réunions
  getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.apiUrl);
  }

   // Récupérer une réunion par id
  getMeeting(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/${id}`);
  }

  // Créer une réunion
  addMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, meeting);
  }

  // Mettre à jour une réunion
  updateMeeting(id: number, meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${id}`, meeting);
  }

  // Supprimer une réunion
  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
