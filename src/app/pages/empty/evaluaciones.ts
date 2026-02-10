import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { AprendizajeGuiadoService, UnidadInterface } from '@/pages/service/aprendizaje.guiado.service';
import { FeedbackIa, TestInterface, TestService } from '@/pages/service/test.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogTestComponent } from '@/layout/dialogs/dialog.test.component';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { data } from 'autoprefixer';
import { DialogFeedbackComponent } from '@/layout/dialogs/dialog.feedback.component';

@Component({
    selector: 'app-evaluaciones',
    standalone: true,
    imports: [NgClass],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Evaluaciones</div>
            <p>
                Método: Pon a prueba lo aprendido <br />
                Mide tu progreso con retos dinámicos diseñados por nuestra IA. Más que una nota, obtendrás un diagnóstico de tus fortalezas y áreas de mejora en TypeScript, con retroalimentación personalizada que te prepara para el siguiente nivel
                del proyecto.
            </p>
        </div>
        <div class="grid grid-cols-12 gap-8">
            @for (project of listOfUnidades; track project) {
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div
                        (click)="recuperarTest(project.idUnidad)"
                        class="card mb-0 transition-all duration-300"
                        [ngClass]="{
                            'opacity-50 pointer-events-none select-none': isAnyLoading && !loadingStates[project.idUnidad],
                            'cursor-wait': loadingStates[project.idUnidad],
                            'cursor-pointer': !isAnyLoading
                        }"
                    >
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">{{ project.description }}</span>
                                @if (loadingStates[project.idUnidad]) {
                                    <div class="spinner-overlay" id="spinner-quiz-principal">
                                        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                                        <p>Generando test con IA, por favor no salgas de esta pantalla...</p>
                                    </div>
                                }
                                <!--                                <p-tag  value="{{project.description}}" [rounded]="true"></p-tag>-->
                            </div>
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-receipt text-blue-500 text-xl!"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">Descripción: </span>
                        <span class="text-muted-color">{{ project.description }}</span>
                    </div>
                </div>
            }
        </div>



     <!--   <div class="card flex justify-center">

            <p-dialog header="Anlicemos tus resultados..." [modal]="true" [(visible)]="visible" [style]="{ width: '75rem' }">
                <div class=" card mt-4 bg-gray-900 py-24 sm:py-32">
                    <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                        <h2 class="text-center text-base/7 font-semibold ">Feedback</h2>
                        <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                            <div class="relative lg:row-span-2">
                                <div class="absolute inset-px rounded-lg  lg:rounded-l-4xl"></div>
                                <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(&#45;&#45;radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                    <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                        <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Feedback Técnico</p>
                                        <p class="mt-2 max-w-lg text-sm/6  max-lg:text-center">{{ this.fTecnico }}</p>
                                    </div>
                                    <div class="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm"></div>
                                </div>
                                <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 lg:rounded-l-4xl"></div>
                            </div>
                            <div class="relative lg:row-span-2">
                                <div class="absolute inset-px rounded-lg  max-lg:rounded-t-4xl"></div>
                                <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(&#45;&#45;radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                                    <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                                        <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Nota</p>
                                        <p class="mt-2 max-w-lg text-sm/6  max-lg:text-center">{{this.nota}}</p>
                                    </div>
                                </div>
                                <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-t-4xl"></div>
                            </div>
                            <div class="relative lg:row-span-2">
                                <div class="absolute inset-px rounded-lg  max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
                                <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(&#45;&#45;radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                    <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                        <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Consejos</p>
                                        <p class="mt-2 max-w-lg text-sm/6  max-lg:text-center">{{this.consejos}}</p>
                                    </div>
                                </div>
                                <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </p-dialog>
        </div>-->
    `,
    providers: [DialogService]
})
export class Evaluaciones implements OnInit {
    listOfUnidades: UnidadInterface[] | undefined;
    loadingStates: { [key: string]: boolean } = {};
    testIa: TestInterface | any;

    //Data feedback
    fTecnico: string | null = null;
    nota: number | null = null;
    consejos: string | null = null;

    visible: boolean = false;

    showDialog(nota: number, fTecnico: string) {
        this.visible = true;
        this.nota = nota;
        this.fTecnico = fTecnico;
        this.cd.detectChanges();
        // this.consejos = consejos;
    }

    get isAnyLoading(): boolean {
        return Object.values(this.loadingStates).some((state) => state);
    }

    constructor(
        private readonly aprendizajeguiado: AprendizajeGuiadoService,
        private readonly testService: TestService,
        private dialogService: DialogService,
        private cd: ChangeDetectorRef // <--- Agrega esto
    ) {}

    ngOnInit() {
        const list = this.aprendizajeguiado.getAllAreas().subscribe({
            next: (data) => {
                this.listOfUnidades = data;
            },
            error: (err) => {
                console.error('Error fetching areas:', err);
            }
        });
    }

    recuperarTest(idUnidad: string) {
        this.loadingStates[idUnidad] = true;
        const list = this.testService.createTest({ message: '', userId: '', idConversationMain: '', idTemaConversacion: idUnidad, mode: 'Libre' }).subscribe({
            next: (data) => {
                console.log(data);
                this.testIa = data;
                this.loadingStates[idUnidad] = false; // Importante: apagar al recibir
                this.abrirEvaluacion(this.testIa, idUnidad);
            },
            error: (err) => {
                this.loadingStates[idUnidad] = false; // Apagar también en error
                console.error('Error fetching areas:', err);
            }
        });
    }

    abrirEvaluacion(testIa: TestInterface, idUnidad: string) {
            const ref = this.dialogService.open(DialogTestComponent, {
                header: 'Evaluación',
                data: { testEvaluacion: testIa, id: idUnidad },
                width: '100%',
                height: '100%'
            });


        ref.onClose.subscribe((dataDelExamen: FeedbackIa) => {
            if (dataDelExamen) {
                this.mostrarFeedback(dataDelExamen);
            }
        });
    }


    mostrarFeedback(resultado: FeedbackIa) {
        this.dialogService.open(DialogFeedbackComponent, {
            header: 'Análisis de Resultados',
            data: resultado, // Pasamos todo el objeto FeedbackIa
            width: '80vw',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true
        });
    }

/*
    private procesarYMostrarResultado(data: any) {
        // 3. Llamamos al backend de NestJS para calificar con Gemini
        this.testService.calificarConIA(data).subscribe(resultadoIA => {

            // 4. Abrimos el SEGUNDO diálogo (Resultados) con info diferente
            this.dialogService.open(DialogResultadoComponent, {
                header: 'Tu Informe de Rendimiento',
                data: {
                    score: resultadoIA.nota,
                    feedback: resultadoIA.feedback_tecnico,
                    consejos: resultadoIA.recomendaciones,
                    ruta: resultadoIA.ruta_recomendada
                },
                width: '500px'
            });
        });
    }
*/
}
