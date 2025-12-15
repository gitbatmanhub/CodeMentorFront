import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { RadioButton } from 'primeng/radiobutton';
import { AprendizajeGuiadoService } from '@/pages/service/aprendizaje.guiado.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionaryService } from '@/pages/service/questionary.service';

interface Option {
    idOption: number;
    option_label: string;
    option_text: string;
    score: number;
    profile_hint: string;
}

interface Question {
    idQuestion: number;
    question_text: string;
    options: Option[];
}

interface UserAnswer {
    questionId: number;
    selectedOptionId: number;
}

@Component({
    selector: 'app-dialog-encuesta',
    standalone: true,
    imports: [
        CommonModule,
        ProgressBarModule,
        BadgeModule,
        AvatarModule,
        ScrollPanelModule,
        TagModule,
        ChipModule,
        ButtonModule,
        SkeletonModule,
        AvatarGroupModule,
        ScrollTopModule,
        OverlayBadgeModule,
        Stepper,
        StepList,
        Step,
        StepPanels,
        StepPanel,
        RadioButton,
        FormsModule,
        ReactiveFormsModule
    ],
    template: `
        <div class="card flex justify-center">
            <p-stepper [value]="currentStep">
                <p-step-list>
                    @for (question of questions; track question.idQuestion; let i = $index) {
                        <ng-container>
                            <p-step [value]="i + 1"></p-step>
                        </ng-container>
                    }
                </p-step-list>

                <p-step-panels>
                    @for (question of questions; track question.idQuestion; let i = $index) {
                        <ng-container>
                            <p-step-panel [value]="i + 1">
                                <ng-template #content let-activateCallback="activateCallback">
                                    <div class="flex flex-col gap-6 p-4" [style]="{ width: '100%' }">
                                        <h3 class=" font-bold  dark:text-primary-400">{{ i + 1 }}. {{ question.question_text }}</h3>
                                        <div class="flex flex-col gap-4">
                                            <form [formGroup]="encuestaForm" class="">
                                                @for (option of question.options; track option.idOption) {
                                                    <div class="flex items-center">
                                                        <p-radioButton
                                                            [inputId]="'option_' + option.idOption"
                                                            [name]="'question_' + question.idQuestion"
                                                            [value]="option.idOption"
                                                            (onClick)="selectOption(question.idQuestion, option.idOption)"
                                                            class="mr-3"
                                                            formControlName="response{{ i + 1 }}"
                                                        />
                                                        <label
                                                            [for]="'option_' + option.idOption"
                                                            class="cursor-pointer text-lg p-3 rounded-lg flex-auto
                                                  transition-colors duration-200
                                                  hover:bg-surface-50 dark:hover:bg-surface-800"
                                                            [ngClass]="{
                                                                'font-medium text-primary-700 dark:text-primary-300 bg-primary-50/20 dark:bg-primary-900/40 border border-primary-300 dark:border-primary-700': isSelected(
                                                                    question.idQuestion,
                                                                    option.idOption
                                                                )
                                                            }"
                                                        >
                                                            <span class="font-bold mr-2">{{ option.option_label }}:</span>
                                                            {{ option.option_text }}
                                                        </label>
                                                    </div>
                                                }
                                            </form>
                                        </div>
                                    </div>

                                    <div class="flex pt-6 justify-between">
                                        @if (i > 0){
                                            <p-button  label="Atrás" severity="secondary" icon="pi pi-arrow-left" (onClick)="prevStep(activateCallback, i)" />
                                        }

                                        @if (i === 0){
                                            <div ></div>

                                        }

                                        @if (i < totalSteps - 1) {
                                            <p-button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" [disabled]="!isQuestionAnswered(question.idQuestion)" (onClick)="nextStep(activateCallback, i + 2)" />

                                        }

                                        @if (i === totalSteps - 1){
                                            <p-button  label="Finalizar Cuestionario" icon="pi pi-check" iconPos="right" severity="success" [disabled]="!isQuestionAnswered(question.idQuestion)" (onClick)="finishQuiz()" />

                                        }



                                    </div>
                                </ng-template>
                            </p-step-panel>
                        </ng-container>
                    }
                </p-step-panels>
            </p-stepper>
        </div>
    `,
    providers: [AprendizajeGuiadoService]
})
export class DialogEncuesta implements OnInit {
    questions: Question[] = [];

    encuestaForm: FormGroup<{
        response1: FormControl<string>;
        response2: FormControl<string>;
        response3: FormControl<string>;
        response4: FormControl<string>;
        response5: FormControl<string>;
        response6: FormControl<string>;
        response7: FormControl<string>;
        response8: FormControl<string>;
        response9: FormControl<string>;
        response10: FormControl<string>;
    }>;

    constructor(
        private aprendizajeGuiadoService: AprendizajeGuiadoService,
        private fb: FormBuilder,
        private questionaryService: QuestionaryService,
    ) {
        this.encuestaForm = fb.group({
            response1: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response2: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response3: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response4: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response5: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response6: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response7: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response8: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response9: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
            response10: this.fb.control('', { nonNullable: true, validators: [Validators.required] })
        });
    }


    submitEncuesta() {
        console.log(this.encuestaForm.value);
        if (this.encuestaForm.valid) {
            // console.log('Formulario válido, enviando datos:', this.encuestaForm.value);
            // Aquí puedes agregar la lógica para enviar los datos al servidor o procesarlos según sea necesario.
        }
    }

    // Mantener un registro de las respuestas del usuario
    userAnswers: UserAnswer[] = [];

    // Paso actual para el stepper (comienza en 1, el primer paso)
    currentStep: number = 1;

    // La cantidad total de pasos es el número de preguntas
    totalSteps: number = 0;

    ngOnInit(): void {
        this.aprendizajeGuiadoService.getAllPreguntas().subscribe((data) => {
            if (data && data.length > 0) {
                console.log(data);
                this.questions = data;
                // **CORRECCIÓN 1: Inicializar variables DEPENDIENTES DE DATOS AQUÍ**
                this.totalSteps = data.length;
                this.initializeUserAnswers(); // Llamamos a la función de inicialización
            } else {
                console.warn('No se recibieron preguntas desde el servicio.');
            }
        });
    }

    private initializeUserAnswers(): void {
        this.userAnswers = []; // Limpiar por si acaso
        this.questions.forEach((q) => {
            // Aseguramos que la respuesta se inicialice solo si la pregunta no existe
            if (!this.userAnswers.find((a) => a.questionId === q.idQuestion)) {
                this.userAnswers.push({ questionId: q.idQuestion, selectedOptionId: 0 });
            }
        });
    }

    /**
     * Maneja la selección de una opción de respuesta.
     * @param questionId El ID de la pregunta.
     * @param optionId El ID de la opción seleccionada.
     */
    selectOption(questionId: number, optionId: number): void {
        console.log(`Pregunta ID: ${questionId}, Opción seleccionada ID: ${optionId}`);
        const answerIndex = this.userAnswers.findIndex((a) => a.questionId === questionId);
        if (answerIndex !== -1) {
            this.userAnswers[answerIndex].selectedOptionId = optionId;
        }
    }

    /**
     * Verifica si una opción específica fue seleccionada para una pregunta.
     * @param questionId El ID de la pregunta.
     * @param optionId El ID de la opción.
     * @returns True si la opción está seleccionada, False en caso contrario.
     */
    isSelected(questionId: number, optionId: number): boolean {
        const answer = this.userAnswers.find((a) => a.questionId === questionId);
        return answer ? answer.selectedOptionId === optionId : false;
    }

    /**
     * Verifica si el paso actual ha sido respondido.
     * @param questionId El ID de la pregunta.
     * @returns True si ya hay una opción seleccionada.
     */
    isQuestionAnswered(questionId: number): boolean {
        const answer = this.userAnswers.find((a) => a.questionId === questionId);
        return answer! && answer.selectedOptionId !== 0;
    }

    /**
     * Avanza al siguiente paso.
     * @param activateCallback Función de PrimeNG para cambiar de paso.
     * @param nextStep El índice del siguiente paso.
     */
    nextStep(activateCallback: (step: number) => void, nextStep: number): void {
        // Obtenemos el índice basado en el paso actual (1-based)
        const currentQuestionIndex = this.currentStep - 1;

        // Verificamos si la pregunta actual existe y está respondida
        if (currentQuestionIndex >= 0 && currentQuestionIndex < this.questions.length) {
            const currentQuestion = this.questions[currentQuestionIndex];

            if (this.isQuestionAnswered(currentQuestion.idQuestion)) {
                this.currentStep = nextStep;
                activateCallback(nextStep);
            } else {
                // Mensaje amigable
                alert('Por favor, selecciona una opción para continuar.');
            }
        }
    }

    /**
     * Retrocede al paso anterior.
     * @param activateCallback Función de PrimeNG para cambiar de paso.
     * @param prevStep El índice del paso anterior.
     */
    prevStep(activateCallback: (step: number) => void, prevStep: number): void {
        this.currentStep = prevStep;
        activateCallback(prevStep);
    }

    /**
     * Lógica a ejecutar al finalizar el cuestionario.
     */
    finishQuiz(): void {

        const payload = {
            answers: this.userAnswers
        };
        console.log('Respuestas del usuario:', this.userAnswers);
        this.questionaryService.sendQuestionary(payload).subscribe(
            (response) => {
                console.log('Cuestionario enviado exitosamente:', response);
            },
        )
        alert('¡Has completado el cuestionario!');
    }
}
