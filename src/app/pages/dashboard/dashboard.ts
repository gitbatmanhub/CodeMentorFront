import { Component, OnInit } from '@angular/core';
import { StatsWidget } from './components/statswidget';
import { Dialog } from 'primeng/dialog';
import { DialogEncuesta } from '@/layout/dialogs/dialog.encuesta';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, ReactiveFormsModule, Dialog, DialogEncuesta],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />

        </div>


        @if (visible){
            <div class="card flex justify-center">
                <p-dialog header="Encuesta - Creación de perfil" closable="false" [(visible)]="visible" [modal]="true" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" [style]="{ width: '75vw' }" [draggable]="false" [resizable]="false">
                    <app-dialog-encuesta />
                </p-dialog>
            </div>
        }

    `,
    standalone: true
})
export class Dashboard implements OnInit {
    encuestado: boolean = false;
    visible: boolean = false;

    ngOnInit(): void {
        if (localStorage.getItem('encuestado') === 'false') {
            this.encuestado = false;
        } else if (localStorage.getItem('encuestado') === 'true') {
            this.encuestado = true;
        } else {
            this.encuestado = false;
        }

        if (!this.encuestado) {
            this.showDialogEncuesta();
        }
    }

    showDialogEncuesta() {
        this.visible = true;
    }
}
