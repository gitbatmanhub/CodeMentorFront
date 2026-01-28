import { Component } from '@angular/core';

import { StatsWidget } from '@/pages/dashboard/components/statswidget';
import { ChatComponent } from '@/pages/chat/chat-free.component';

@Component({
    selector: 'app-aprendizajelibre',
    standalone: true,
    imports: [ ChatComponent],
    template: `
        <app-free-chat/>
    `
})
export class Aprendizajelibre {}
