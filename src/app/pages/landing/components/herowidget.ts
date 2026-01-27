import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, RouterLink],
    template: `
        <div
            id="hero"
            class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
            style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
        >
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight dark:!text-gray-700"><span class="font-light block">Aprende a programar</span>de forma práctica e interactiva</h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700 dark:text-gray-700">
                    Una aplicación diseñada para facilitar el aprendizaje de la programación mediante ejercicios guiados, retroalimentación inmediata y una experiencia adaptada a cada usuario.
                </p>
                <button routerLink="/auth/login" pButton pRipple [rounded]="true" type="button" label="Comencemos..." class="text-xl! mt-8 px-4!"></button>
            </div>
            <div class="flex justify-center md:justify-end">
                <img src="assets/img/screen1.png" alt="Hero img" class="w-9/12 md:w-auto" />
            </div>
        </div>
    `
})
export class HeroWidget {}
