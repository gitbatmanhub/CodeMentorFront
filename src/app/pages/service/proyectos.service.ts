import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface ProyectosInterface {
    idProjecto: string
    nombre: string
    descripcion: string
    dificultad: string;

}



@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projectosApi = environment.apiUrl + '/projects';

    constructor(private http: HttpClient) {}


    getProjectById(idTema: string): Observable<ProyectosInterface> {
        return this.http.get<ProyectosInterface>(`${this.projectosApi}/${idTema}`).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

    getProjects(): Observable<ProyectosInterface[]> {
        return this.http.get<ProyectosInterface[]>(`${this.projectosApi}`).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

}
