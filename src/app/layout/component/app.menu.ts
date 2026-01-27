import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@/auth/services/auth';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                label: 'Principal',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Perfil',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/dashboard/perfil']
                    }
                ]
            },
            {
                label: 'Aprendizaje',
                items: [
                    {
                        label: 'Aprendizaje',
                        icon: 'pi pi-fw pi-book',
                        items: [
                            {
                                label: 'Aprendizaje libre',
                                icon: 'pi pi-fw pi-microchip-ai',
                                routerLink: ['/dashboard/free']
                            },
                            {
                                label: 'Aprendizaje Guiado',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/dashboard/guia']
                            },
                            {
                                label: 'Proyectos',
                                icon: 'pi pi-fw pi-hammer',
                                routerLink: ['/dashboard/proyectos']
                            }
                        ]
                    }
                ]
            },

            {
                label: 'Evaluacion',
                items: [
                    {
                        label: 'Evaluaciones',
                        icon: 'pi pi-fw pi-receipt'
                    }
                ]
            },
            {
                label: 'Aplicación',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Salir',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => {
                            this.authService.logout();
                        }
                    }
                ]
            }
        ];
    }
}
