import { Component, OnInit } from '@angular/core';
import { ProfileInterface, ProfileService } from '@/pages/service/profile.service';
import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogEncuesta } from '@/layout/dialogs/dialog.encuesta';
import { visible } from 'ansi-colors';

@Component({
    selector: 'app-profile',
    imports: [Button, Dialog, DialogEncuesta],
    template: `
        <div class="card">
            <div class="px-4 sm:px-0">
                <h3 class="text-base/7 font-semibold ">Información de perfil</h3>
                <p class="mt-1 max-w-2xl text-sm/6 ">Detalles personales y generador por CodeMentor.</p>
            </div>
            <div class="mt-6 border-t border-white/10">
                <dl class="divide-y divide-white/10">
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="text-sm/6 font-medium ">Nombre completo</dt>
                        <dd class="mt-1 text-sm/6  sm:col-span-2 sm:mt-0">{{ usuario?.nombreCompleto }}</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="text-sm/6 font-medium ">Email</dt>
                        <dd class="mt-1 text-sm/6  sm:col-span-2 sm:mt-0">{{ usuario?.email }}</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="text-sm/6 font-medium ">Perfil Creado</dt>
                        <dd class="mt-1 text-sm/6  sm:col-span-2 sm:mt-0">{{ usuario?.perfilDelJoven }}</dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="text-sm/6 font-medium">Fortalezas identificadas</dt>
                        <dd class="mt-1 text-sm/6 sm:col-span-2 sm:mt-0 space-y-4">
                            @for (fortaleza of usuario?.fortalezasIdentificadas; track fortaleza.nombre) {
                                <div>
                                    <p class="font-semibold">
                                        {{ fortaleza.nombre }}
                                    </p>
                                    <p class="text-sm opacity-80">
                                        {{ fortaleza.descripcion }}
                                    </p>
                                </div>
                            }
                        </dd>
                    </div>
                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt class="text-sm/6 font-medium">Recomendaciones personalizadas</dt>
                        <dd class="mt-1 text-sm/6 sm:col-span-2 sm:mt-0 space-y-4">
                            @for (recomendacion of usuario?.recomendacionesPersonalizadas; track recomendacion.nombre) {
                                <div>
                                    <p class="font-semibold">
                                        {{ recomendacion.nombre }}
                                    </p>
                                    <p class="text-sm opacity-80">
                                        {{ recomendacion.descripcion }}
                                    </p>
                                </div>
                            }
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="card flex justify-center">
            <p-button (click)="showDialogEncuesta()" size="large" label="Volver a hacer la encuesta" />
            <p-dialog header="Encuesta - Creación de perfil" [(visible)]="visible" [modal]="true" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" [style]="{ width: '75vw' }" [draggable]="false" [resizable]="false">
                <app-dialog-encuesta />
            </p-dialog>
        </div>
    `,
    standalone: true
})
export class ProfileComponent implements OnInit {
    usuario: ProfileInterface | undefined;

    visible: boolean = false;

    constructor(private profileService: ProfileService) {}

    idUsuario: string = 'f6dc28f1-3034-4460-a6c3-0ae8c47840aa';

    ngOnInit() {
        this.profileService.getProfile(this.idUsuario).subscribe((data) => {
            console.log(data);
            this.usuario = data;
        });
        // Initialization logic here
    }

    showDialogEncuesta() {
        this.visible = true;
    }

}
