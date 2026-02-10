import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dialog-feedback',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
         <div class=" card mt-4 bg-gray-900 py-24 sm:py-32">
               <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                   <h2 class="text-center text-base/7 font-semibold ">Feedback</h2>
                   <div class="mt-10 flex justify-center">
                       <p-button label="Entendido" (onClick)="ref.close()" severity="success"></p-button>
                   </div>
                   <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">

                       <div class="relative lg:row-span-2">
                           <div class="absolute inset-px rounded-lg  lg:rounded-l-4xl"></div>
                           <div class="relative flex  flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                               <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                   <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Feedback Técnico</p>
                                   <p class="mt-2 max-w-lg text-sm/6  max-lg:text-center">{{ data.feedback_tecnico }}</p>
                               </div>
                               <div class="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm"></div>
                           </div>
                           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 lg:rounded-l-4xl"></div>
                       </div>
                       <div class="relative max-lg:row-start-1">
                           <div class="absolute inset-px rounded-lg  max-lg:rounded-t-4xl"></div>
                           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                               <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                   <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Nota</p>
                                   <p class="mt-2 max-w-lg text-sm/6  max-lg:text-center">Recuerda: no eres un número. Tu aprendizaje es un camino continuo y este resultado es solo una fotografía del momento, no el destino final. Cada error es una línea de código que hoy comprendes mejor que ayer. ¡Sigue construyendo!</p>
                               </div>
                               <div class="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                   <div class="px-8 pt-8 sm:px-10 sm:pt-10">

                                       <div class="mt-4 text-5xl text-center font-bold text-blue-500">
                                           {{ data.nota }}/10
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-t-4xl"></div>
                       </div>
                       <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                           <div class="absolute inset-px rounded-lg "></div>
                           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                               <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                                   <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Ruta recomendada</p>
                                   <p class="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">{{ data.ruta_recomendada.mensaje }}</p>
                               </div>

                           </div>
                           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
                       </div>
                       <!--<div class="relative lg:row-span-2">
                           <div class="absolute inset-px rounded-lg  max-lg:rounded-t-4xl"></div>
                           <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(&#45;&#45;radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                               <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                                   <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Nota</p>
                                   <div class="mt-4 text-5xl text-center font-bold text-blue-500">
                                       {{ data.nota }}/10
                                   </div>
                               </div>

                           </div>
                           <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                               <div class="absolute inset-px rounded-lg bg-gray-800"></div>
                               <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(&#45;&#45;radius-lg)+1px)]">
                                   <div class="px-8 pt-8 sm:px-10 sm:pt-10">
                                       <p class="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">Security</p>
                                       <p class="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.</p>
                                   </div>
                                   <div class="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                       <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png" alt="" class="h-[min(152px,40cqw)] object-cover" />
                                   </div>
                               </div>
                               <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
                           </div>

                           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-t-4xl"></div>
                       </div>-->
                       <div class="relative lg:row-span-2">
                           <div class="absolute inset-px rounded-lg  max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
                           <div class="relative flex  flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                               <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                   <p class="mt-2 text-lg font-medium tracking-tight  max-lg:text-center">Consejos</p>
                                   <ul class="mt-4 space-y-2">
                                       @for (item of data.consejos_mejora; track item) {
                                           <li class="text-sm  flex gap-2">
                                               <span class="text-blue-500">•</span> {{ item }}
                                           </li>
                                       }
                                   </ul>
                               </div>
                           </div>
                           <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
                       </div>

                   </div>
               </div>
           </div>



    `
})
export class DialogFeedbackComponent implements OnInit {
    data: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit() {
        // Aquí recibimos la data que enviamos desde evaluaciones.ts
        this.data = this.config.data;
    }
}
