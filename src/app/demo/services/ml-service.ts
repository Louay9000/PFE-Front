import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// ⚡ Interface pour les probabilités ML
export interface TaskProbabilities {
  proba_REACHED: number;
  proba_INPROGRESS: number;
  proba_UNREACHED: number;
}

@Injectable({
  providedIn: 'root'
})
export class MlService {

  private baseUrl = 'http://localhost:8085/mlservice';

  private Url = 'http://127.0.0.1:5001'; // Port durée
  private taskUrl = 'http://127.0.0.1:5000'; // Port état

  constructor(private http: HttpClient) { }


 // Méthode typée pour récupérer les probabilités
  getTaskProbabilities(task: { taskWeight: number, taskStartValue: number, taskDoneValue: number }): Observable<TaskProbabilities> {
    return this.http.post<TaskProbabilities>(`${this.baseUrl}/predict`, task);
  }

 predictDuration(task: any): Observable<{ taskDuration: number }> {
    return this.http.post<{ taskDuration: number }>(`${this.Url}/predict-duration`, task);
  }

}
