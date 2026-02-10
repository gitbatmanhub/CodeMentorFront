import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatIAInterface } from '@/pages/service/chat-ia.service';
import { RespuestaInterface } from '@/layout/dialogs/dialog.test.component';

export interface TestInterface {
    evaluacion: Evaluacion,
    idUnidad: string
}

export interface Evaluacion {
    titulo: string
    preguntas: Pregunta[]
    ejercicio_practico: EjercicioPractico
}

export interface Pregunta {
    id: number,
    pregunta: string,
    opciones: string[],
    codigoEjemplo: string,
    respuesta_correcta_index: number,
    pista: string
}

export interface EjercicioPractico {
    titulo: string
    descripcion: string
    codigo_inicial: string
    solucion_esperada_hint: string
    max_lineas: number
}

export interface ResultadoTest {
    puntaje: number;
    totalPreguntas: number;
    aciertos: number;
    detalles: DetalleResultado[];
    aprobado: boolean;
}

export interface DetalleResultado {
    idPregunta: number;
    esCorrecta: boolean;
    pista: string; // Para mostrar solo si falló
}

export interface FeedbackIa {
    nota: number
    aprobado: boolean
    feedback_tecnico: string
    consejos_mejora: string[]
    ruta_recomendada: RutaRecomendada
}

export interface RutaRecomendada {
    mensaje: string
    accion: string
}



@Injectable({
    providedIn: 'root'
})
export class TestService {
    private apiUrl = environment.apiUrl + '/gemini/testProject';
    private apiUrlTest = environment.apiUrl + '/gemini/evaluateTest';


    constructor(private http: HttpClient) {}

    createTest(message: ChatIAInterface): Observable<any | TestInterface> {
        return this.http.post<TestInterface>(this.apiUrl, message).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

    // En tu archivo .component.ts

    validarTest(evaluacion: Evaluacion, respuestasUsuario: { [key: number]: number }): ResultadoTest {
        const preguntas = evaluacion.preguntas;
        let aciertos = 0;

        const detalles: DetalleResultado[] = preguntas.map(pregunta => {
            const respuestaMarcarada = respuestasUsuario[pregunta.id];
            const esCorrecta = respuestaMarcarada === pregunta.respuesta_correcta_index;

            if (esCorrecta) aciertos++;

            return {
                idPregunta: pregunta.id,
                esCorrecta: esCorrecta,
                pista: esCorrecta ? '' : pregunta.pista
            };
        });

        const puntaje = (aciertos / preguntas.length) * 100;

        return {
            puntaje,
            totalPreguntas: preguntas.length,
            aciertos,
            detalles,
            aprobado: puntaje >= 70 // Umbral del 70% por ejemplo
        };
    }

    // En tu TestService añadirías algo así:
    validarCodigo(ejercicio: RespuestaInterface): Observable<any | FeedbackIa> {
        return this.http.post<FeedbackIa>(this.apiUrlTest , ejercicio).pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }


}
