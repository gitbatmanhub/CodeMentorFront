import { Component, OnInit } from '@angular/core';
import { AprendizajeGuiadoService, UnidadInterface } from '@/pages/service/aprendizaje.guiado.service';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { RouterLink } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Avatar } from 'primeng/avatar';


@Component({
    selector: 'app-aprendizajeguiado',
    standalone: true,
    imports: [Accordion, AccordionPanel, AccordionHeader, AccordionContent, ProgressBar, Avatar, RouterLink],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Aprendizaje guiado</div>
            <p>
                Método: Sigue un temario <br />
                Descripción: Avanza paso a paso a través de un temario estructurado diseñado para que aprendas programación desde cero hasta conceptos avanzados. <br />
                Cada unidad incluye teoría, ejemplos, ejercicios y evaluaciones que te permitirán progresar con claridad y medir tu aprendizaje.
            </p>
        </div>
        <div class="">
            <p-accordion [value]="0">
                @for (tab of listOfUnidades; track tab.idUnidad) {
                    <p-accordion-panel [value]="tab.description">
                        <p-accordion-header>
                            <span class="flex items-center gap-2 w-full">
                                @if (tab.duracionHoras > 5) {
                                    <p-avatar icon="pi pi-book" shape="circle" />
                                } @else {
                                    <p-avatar class="mr-2" icon="pi pi-verified" size="normal" [style]="{ 'background-color': '#2196F3', color: '#ffffff' }" shape="circle"></p-avatar>
                                }

                                <span class="font-bold whitespace-nowrap">{{ tab.description }}</span>
                            </span>
                            <!--<div class="flex gap-1.5">
                                <p-tag icon="pi pi-check" severity="success" value="Terminado"></p-tag>
                                <p-badge value="{{tab.duracionHoras}}hrs" class="ml-auto mr-2" />

                            </div>-->
                        </p-accordion-header>
                        <p-accordion-content>
                            <div class="grid grid-cols-12 ">
                                @for (tema of tab.temas; track tema.idTema) {
                                    <div class=" cursor-pointer col-span-12 lg:col-span-6 xl:col-span-3">
                                        <div class="border-b-gray-500 p-1 card mb-0">
                                            <a routerLink="/dashboard/chat/{{tema.idTema}}">

                                            <div class="flex justify-between mb-4">
                                                <div>
                                                    <span class="block text-muted-color font-medium mb-4">{{ tema.descripcion }}</span>
                                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-sm">Instructor/es: {{ tema.instructores }}</div>
                                                </div>
                                                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                                    <i class="pi pi-microchip-ai text-blue-500 text-xl!"></i>
                                                </div>
                                            </div>
                                            <div class="md:w-2/2 mb-2">
                                                <span class="text-primary font-medium">Avance: </span>
                                                <p-progressbar [value]="6" [showValue]="true"></p-progressbar>
                                            </div>
                                            <span class="text-primary font-medium">Dificultad: </span>
                                            <span class="text-muted-color"> {{ tema.nivelDificultad }}</span>
                                            </a>

                                        </div>
                                    </div>
                                }
                            </div>
                        </p-accordion-content>
                    </p-accordion-panel>
                }
            </p-accordion>
        </div>
    `
})
export class Aprendizajeguiado implements OnInit {
    listOfUnidades: UnidadInterface[] | undefined;
    constructor(private readonly aprendizajeguiado: AprendizajeGuiadoService) {}

    ngOnInit() {
        // Lógica de inicialización aquí
        const list = this.aprendizajeguiado.getAllAreas().subscribe({
            next: (data) => {
                this.listOfUnidades = data;
                console.log('Areas fetched successfully:', data);
            },
            error: (err) => {
                console.error('Error fetching areas:', err);
            }
        });
    }
}
