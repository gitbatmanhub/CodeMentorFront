import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



export interface AnswerMainInterface {
    answers: AnswerInterface[]
}
export interface AnswerInterface {
    questionId: number
    selectedOptionId: number
}





@Injectable({
    providedIn: 'root'
})
export class QuestionaryService {
    private apiUrlProfile = environment.apiUrl + '/profile/';
    private apiUrlQuestionary = environment.apiUrl + '/questionary/';

    constructor(private http: HttpClient) {}


    sendQuestionary(data: AnswerMainInterface): Observable<any> {
        return this.http.post<any>(this.apiUrlQuestionary, data).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

}
