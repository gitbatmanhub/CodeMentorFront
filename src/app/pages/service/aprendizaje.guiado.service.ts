import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface UnidadInterface {
    idUnidad: string
    description: string
    duracionHoras: number
    temas: Tema[]
}

export interface Tema {
    idTema: string
    descripcion: string
    duracionHoras: number
    instructores: string
    nivelDificultad: string
    unidad: Unidad,
    isTest: boolean
}

export interface Unidad {
    idUnidad: string
    description: string
    duracionHoras: number
}



export interface PreguntaInterface {
    idQuestion: number
    question_text: string
    options: OptionInterface[]
}

export interface OptionInterface {
    idOption: number
    option_label: string
    option_text: string
    score: number
    profile_hint: string
}



@Injectable({
    providedIn: 'root'
})
export class AprendizajeGuiadoService {
    private apiUrl = environment.apiUrl + '/temario/unidades';
    private apiPreguntas = environment.apiUrl + '/questionary';

    constructor(private http: HttpClient) {}

    getAllAreas(): Observable<UnidadInterface[]> {
        return this.http.get<UnidadInterface[]>(this.apiUrl).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    getAllPreguntas(): Observable<PreguntaInterface[]> {
        return this.http.get<PreguntaInterface[]>(this.apiPreguntas).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    /*createArea(data: { nameArea: string }): Observable<AreaInterface> {
        return this.http.post<AreaInterface>(this.apiUrl, data).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

    updateArea(id: string, data: { nameArea: string }): Observable<AreaInterface> {
        return this.http.patch<AreaInterface>(`${this.apiUrl}/${id}`, data).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }*/
}
