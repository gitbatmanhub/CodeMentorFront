import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ChatIAInterface {
    message: string
    userId: string
    idConversationMain: string
    idTemaConversacion: string
    mode: string
}



export interface responseInterface {
    text: string;
    idConversationMain: string;
}

export interface Historial {
    _id: string
    userId: string
    title: string
    idTemaConversacion: string
    mode: string
    createdAt: string
    updatedAt: string
    messages: Message[]
    __v: number
}

export interface Message {
    usuarioMessage: string
    iaMessage: string
    createdAt: string
    _id: string
}



@Injectable({
    providedIn: 'root'
})
export class ChatIaService {
    private apiUrl = environment.apiUrl + '/gemini/chat';
    private apiUrlData = environment.apiUrl + '/conversation/user-tema';

    constructor(private http: HttpClient) {}

    chat(message: ChatIAInterface): Observable<any | responseInterface> {
        return this.http.post<responseInterface>(this.apiUrl, message).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    getConversationByTemaAndUsuario(
        idTema: string,
        idUsuario: string,
    ): Observable<Historial> {
        const params = new HttpParams()
            .set('idTema', idTema)
            .set('idUsuario', idUsuario);

        return this.http.get<any>(this.apiUrlData, { params });
    }



}
