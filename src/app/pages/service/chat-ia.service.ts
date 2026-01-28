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
    private apiUrlChatFree = environment.apiUrl + '/gemini/chatFree';
    private apiUrlChatProject = environment.apiUrl + '/gemini/chatProject';
    private apiUrlData = environment.apiUrl + '/conversation/user-mode';
    private apiUrlDataByUser = environment.apiUrl + '/conversation/user-tema';

    constructor(private http: HttpClient) {}

    chat(message: ChatIAInterface): Observable<any | responseInterface> {
        return this.http.post<responseInterface>(this.apiUrl, message).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    chatFree(message: ChatIAInterface): Observable<any | responseInterface> {
        return this.http.post<responseInterface>(this.apiUrlChatFree, message).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    chatProject(message: ChatIAInterface): Observable<any | responseInterface> {
        return this.http.post<responseInterface>(this.apiUrlChatProject, message).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    getConversationByTemaAndUsuario(
        idTema: string,
        idUsuario: string,
        mode?: string,
        idTemaConversacion?: string
    ): Observable<Historial> {

        let params = new HttpParams()
            .set('idTema', idTema)
            .set('idUsuario', idUsuario);

        if (mode) {
            params = params.set('mode', mode);
        }
        if (idTemaConversacion) {
            params = params.set('idTemaConversacion', idTemaConversacion);
        }

        return this.http.get<Historial>(this.apiUrlData, { params });
    }

    getConversacionModoTutor(
        idUsuario: string,
        mode: string,
        idTemaConversacion: string
    ): Observable<Historial> {
        let params = new HttpParams()
            .set('idUsuario', idUsuario)
            .set('mode', mode)
            .set('idTemaConversacion', idTemaConversacion);

        return this.http.get<Historial>(this.apiUrlData, { params });

    }

    getConversationByTemaAndUsuarioMentor(
        idTema: string,
        idUsuario: string,
        mode?: string
    ): Observable<Historial> {

        let params = new HttpParams()
            .set('idTema', idTema)
            .set('idUsuario', idUsuario);



        return this.http.get<Historial>(this.apiUrlDataByUser, { params });
    }




}
