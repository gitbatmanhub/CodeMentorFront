import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface ProfileInterface {
    _id: string
    userId: string
    perfilDelJoven: string
    fortalezasIdentificadas: FortalezasIdentificada[]
    areasADesarrollar: AreasAdesarrollar[]
    recomendacionesPersonalizadas: RecomendacionesPersonalizada[]
    createdAt: string
    updatedAt: string
    __v: number
    nombreCompleto: string
    email: string
}

export interface FortalezasIdentificada {
    nombre: string
    descripcion: string
}

export interface AreasAdesarrollar {
    nombre: string
    descripcion: string
}

export interface RecomendacionesPersonalizada {
    nombre: string
    descripcion: string
}



@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = environment.apiUrl + '/profile';

    constructor(private http: HttpClient) {}

   /* getAllAreas(): Observable<UnidadInterface[]> {
        console.log(this.http.get(this.apiPreguntas));
        return this.http.get<UnidadInterface[]>(this.apiUrl).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }*/

    getProfile(idUsuario: string): Observable<any> {
        return this.http.get<ProfileInterface>(`${this.apiUrl}/${idUsuario}`).pipe(
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
