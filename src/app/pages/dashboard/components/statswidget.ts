import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, RouterLink],
    template: `
        @for (metodo of metodos; track metodo) {
            <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                <div routerLink="/dashboard/{{metodo.link}}" class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">{{ metodo.nombre }}</span>
<!--                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>-->
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi {{ metodo.icon }} text-blue-500 text-xl!"></i>
                        </div>
                    </div>
                    <span class="text-primary font-medium">Método: </span>
                    <span class="text-muted-color"> {{ metodo.metodo }}</span>
                </div>
            </div>
        }
    `
})
export class StatsWidget {
    metodos = [
        { link: 'free', nombre: 'Aprendizaje libre', metodo: 'Pregunta lo que desees', icon: 'pi-microchip-ai', nrestudiantes: 49, descripcion: '' },
        { link: 'guia', nombre: 'Apredizaje guiado', metodo: 'Sigue un temario', icon: 'pi-users', nrestudiantes: 49, descripcion: '' },
        { link: 'proyectos', nombre: 'Proyectos', metodo: 'Trabaja en proyectos', icon: 'pi-hammer', nrestudiantes: 49, descripcion: '' },
        { link: 'evaluaciones', nombre: 'Evaluaciones', metodo: 'Pon en práctica', icon: 'pi-receipt', nrestudiantes: 49, descripcion: '' }
    ];
}
