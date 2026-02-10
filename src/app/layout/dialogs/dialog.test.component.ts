import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

// Importa tus interfaces
import { TestInterface, TestService, FeedbackIa } from '@/pages/service/test.service';

// PrimeNG Imports (los mismos que ya tienes)
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { Dialog } from 'primeng/dialog';
import { MarkdownComponent } from 'ngx-markdown';

export interface RespuestaInterface {

    enunciado: string;

    respuesta: string;

    idUnidad: string

}

@Component({
    selector: 'app-dialog-test',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, StepperModule, RadioButtonModule, ProgressBarModule, ToastModule, MessageModule, TagModule, Textarea, MarkdownComponent],
    template: `
        <p-toast />
        @if (testForm && testData) {
            <div class="card p-2">
                <form [formGroup]="testForm">
                    <h2 class="text-2xl font-bold mb-4 text-primary">{{ testData.evaluacion.titulo }}</h2>

                    <p-stepper [(value)]="currentStep">
                        <p-step-panels>
                            @for (q of testData.evaluacion.preguntas; track q.id; let i = $index) {
                                <p-step-panel [value]="i + 1">
                                    <ng-template #content let-activateCallback="activateCallback">
                                        <div class="flex flex-col gap-4 min-h-[20rem]">
                                            <h3 class="text-xl font-semibold rounded-2xl px-4 py-3 max-w-[85%] border border-white/5 relative group">{{ i + 1 }}. {{ q.pregunta }}</h3>
                                            @if (q.codigoEjemplo) {
                                                <div class="markdown-container prose prose-invert max-w-none">
                                                    <markdown [data]="'\`\`\`typescript\\n' + q.codigoEjemplo + '\\n\`\`\`'"></markdown>
                                                </div>
                                            }

                                            <div class="flex flex-col gap-3">
                                                @for (opt of q.opciones; track opt; let optIdx = $index) {
                                                    <div class="flex items-center p-3 border rounded-lg transition-all" [ngClass]="{ 'border-primary bg-primary/5': testForm.get('question_' + i)?.value === optIdx }">
                                                        <p-radioButton [name]="'question_' + i" [value]="optIdx" [formControlName]="'question_' + i" [inputId]="'q' + i + 'o' + optIdx"> </p-radioButton>

                                                        <label [for]="'q' + i + 'o' + optIdx" class="ml-3 cursor-pointer w-full">
                                                            {{ opt }}
                                                        </label>
                                                    </div>
                                                }
                                            </div>

                                            @if (showHint[i]) {
                                                <div class="p-3 bg-orange-100 text-orange-700 border-l-4 border-orange-500 rounded animate-fadein"><strong>💡 Pista:</strong> {{ q.pista }}</div>
                                            }
                                        </div>

                                        <div class="flex pt-6 justify-end">
                                            <p-button label="Validar Respuesta" icon="pi pi-arrow-right" iconPos="right" [disabled]="testForm.get('question_' + i)?.value === null" (onClick)="nextStep(activateCallback, i + 2, i)"> </p-button>
                                        </div>
                                    </ng-template>
                                </p-step-panel>
                            }

                            <p-step-panel [value]="testData.evaluacion.preguntas.length + 1">
                                <ng-template #content let-activateCallback="activateCallback">
                                    <div class="flex flex-col gap-4  ">
                                        <h3 class="text-xl font-bold">{{ testData.evaluacion.ejercicio_practico.titulo }}</h3>
                                        <p class=" rounded-2xl px-4 py-3 max-w-[85%] border border-white/5 relative group">{{ testData.evaluacion.ejercicio_practico.descripcion }}</p>
                                        <!--                                        <p class=" rounded-2xl px-4 py-3 max-w-[85%] border border-white/5 relative group">{{ testData.evaluacion.ejercicio_practico.codigo_inicial }}</p>-->
                                        @if (testData.evaluacion.ejercicio_practico.codigo_inicial) {
                                            <div class="markdown-container prose prose-invert max-w-none">
                                                <markdown [data]="'\`\`\`typescript\\n' + testData.evaluacion.ejercicio_practico.codigo_inicial + '\\n\`\`\`'"></markdown>
                                            </div>
                                        }

                                        <textarea pInputTextarea formControlName="ejercicio_codigo" rows="8" class="w-full font-mono p-3 border rounded-md shadow-inner" placeholder="Escribe aquí tu respuesta"> </textarea>

                                        <div class="flex justify-between mt-4">
                                            <p-button label="Atrás" severity="secondary" (onClick)="prevStep(activateCallback)"></p-button>
                                            <p-button label="Finalizar Label" severity="success" icon="pi pi-check" (onClick)="finishTest()"></p-button>
                                        </div>
                                    </div>
                                </ng-template>
                            </p-step-panel>
                        </p-step-panels>
                    </p-stepper>
                </form>
            </div>


        }
    `,
    providers: [MessageService],
    styles: `
        /* 1. Evita que el texto normal se monte */
        .prose {
            line-height: 1.6;
            font-size: 0.95rem;
        }

        /* 2. Formato para bloques de código (triple backtick \`\`\`) */
        ::ng-deep .prose pre {
            background-color: #1e1e1e !important; /* Fondo oscuro */
            color: #d4d4d4;
            padding: 1.25rem;
            border-radius: 0.75rem;
            margin: 1rem 0;

            /* ESTO ARREGLA EL SCROLL Y LAS LETRAS MONTADAS */
            overflow-x: auto !important;
            white-space: pre !important;
            word-spacing: normal;
            word-break: normal;
        }

        /* 3. Fuente monoespaciada para que no cambie el tipo de letra */
        ::ng-deep .prose code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            font-size: 0.875em;
        }

        /* 4. Código en línea (single backtick \`) */
        ::ng-deep .prose :not(pre) > code {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 0.4rem;
            white-space: nowrap;
        }
    `
})
export class DialogTestComponent implements OnInit {
    testData!: TestInterface;
    idUnidad: string = '';
    testForm: FormGroup = new FormGroup({});
    currentStep: number = 1;
    isComplete: boolean = false;
    evaluando: boolean = false;
    showHint: boolean[] = []; // Control de visibilidad de pistas por pregunta

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private fb: FormBuilder,
        private messageService: MessageService,
        private testService: TestService
    ) {}

    ngOnInit(): void {
        // Recibir data desde el DialogService
        if (this.config.data) {
            const { testEvaluacion, id } = this.config.data;
            this.testData = testEvaluacion;
            this.idUnidad = id;
            this.buildForm();
        }
    }

    prevStep(activateCallback: any) {
        this.currentStep--;
        activateCallback(this.currentStep);
    }


    private buildForm() {
        const group: any = {};
        this.testData.evaluacion.preguntas.forEach((pregunta, index) => {
            // Genera 'question_0', 'question_1', etc.
            group[`question_${index}`] = new FormControl(null, Validators.required);
        });
        group['ejercicio_codigo'] = new FormControl('', [Validators.required]);
        group['ejercicio_descripcion'] = new FormControl(this.testData.evaluacion.ejercicio_practico.descripcion);

        this.testForm = this.fb.group(group);
    }

    // Validación lógica: ¿La respuesta marcada es la correcta?
    isCorrect(questionIndex: number): boolean {
        const control = this.testForm.get(`question_${questionIndex}`);
        if (!control?.value && control?.value !== 0) return false;

        return control.value === this.testData.evaluacion.preguntas[questionIndex].respuesta_correcta_index;
    }

    nextStep(activateCallback: any, nextVal: number, index: number) {
        const selectedAnswer = this.testForm.get(`question_${index}`)?.value;
        const correctAnswer = this.testData.evaluacion.preguntas[index].respuesta_correcta_index;

        if (selectedAnswer === correctAnswer) {
            this.showHint[index] = false;
            this.currentStep = nextVal;
            activateCallback(nextVal); // Esto mueve el Stepper físicamente
        } else {
            this.showHint[index] = true; // Muestra la pista si falló
            this.messageService.add({
                severity: 'error',
                summary: 'Respuesta incorrecta',
                detail: 'Inténtalo de nuevo con la pista.'
            });
        }
    }

    finishTest() {
        this.evaluando = true;

        if (this.testForm.valid) {
            this.isComplete = true;
            // Enviamos los resultados de vuelta a quien abrió el diálogo
        }
        const newRespuesta: RespuestaInterface = {
            respuesta: this.testForm.get('ejercicio_codigo')?.value,
            enunciado: this.testForm.get('ejercicio_descripcion')?.value,
            idUnidad: this.idUnidad
        };

        this.testService.validarCodigo(newRespuesta).subscribe({
            next: (data: FeedbackIa) => {
                    this.ref.close(data)
                    console.log('Resultado validación código:', data);
                    this.evaluando = false;
            }
        });
        this.evaluando = false;
    }

    private calculateScore(): number {
        // Lógica de puntuación...
        return 100;
    }
}
