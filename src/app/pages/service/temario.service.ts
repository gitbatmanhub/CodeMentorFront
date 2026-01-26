import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface TemaInterface {
    idTema: string
    descripcion: string
    duracionHoras: number
    instructores: string
    nivelDificultad: string
    unidad: UnidadInterface
}

export interface UnidadInterface {
    idUnidad: string
    description: string
    duracionHoras: number
}



@Injectable({
    providedIn: 'root'
})
export class TemarioService {
    private temarioApi = environment.apiUrl + '/temario';

    constructor(private http: HttpClient) {}


    getTema(idTema: string): Observable<TemaInterface> {
        return this.http.get<TemaInterface>(`${this.temarioApi}/${idTema}`).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

}
