import { Component, OnInit } from '@angular/core';

import { StatsWidget } from '@/pages/dashboard/components/statswidget';
import { HttpClient } from '@angular/common/http';
import { ProjectService, ProyectosInterface } from '@/pages/service/proyectos.service';
import { RouterLink } from '@angular/router';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-proyectos',
    standalone: true,
    imports: [RouterLink, Tag],
    template: `
        <div class="grid grid-cols-12 gap-8">
            @for (project of projects; track project) {
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div routerLink="/dashboard/proyectos/{{ project.idProjecto }}" class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">{{ project.nombre }}</span>
                                <p-tag  value="{{project.dificultad}}" [rounded]="true"></p-tag>
                            </div>
                            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-hammer text-blue-500 text-xl!"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">Descripción: </span>
                        <span class="text-muted-color">{{ project.descripcion }}</span>
                    </div>
                </div>
            }
        </div>
    `
})
export class Proyectos implements OnInit {
    projects: ProyectosInterface | any;
    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        // Initialization logic can go here

        this.projectService.getProjects().subscribe((data) => {
            console.log(data);
            this.projects = data;
            console.log(this.projects);
        });
    }
}
