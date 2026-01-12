import { Component, OnInit, input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { isPlatformBrowser } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { IftaLabel } from 'primeng/iftalabel';

interface ChatMessage {
    id: number;
    role: 'user' | 'ai';
    content: string;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, Button, InputText, IconField, Toolbar],
    template: `

        <div class="card ">
            <p-toolbar class="sticky">
                <ng-template #start>
                    <p-button icon="pi pi-print" class="mr-2" severity="secondary" text />
                </ng-template>

                <ng-template #center>
                    <p-iconfield>
                        <p class="font-bold"><i class="pi pi-microchip-ai"></i> Chat name</p>
                    </p-iconfield>
                </ng-template>

                <ng-template #end>
                    <p-button icon="pi pi-download" severity="secondary" text />
                </ng-template>
            </p-toolbar>
        </div>
        <div class=" relative min-h-[calc(90vh-4rem)]   text-white flex justify-center" #scrollContainer>
            <div class="w-full  max-w-3xl flex flex-col min-h-full">
                <div class="flex-1 px-4 py-8 space-y-6">
                    @for (message of messages; track message.id) {
                        <div [class]="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                            <div [class]="message.role === 'user' ? 'bg-blue-600 rounded-2xl px-4 py-2 max-w-[85%]' : 'bg-neutral-800 rounded-2xl px-4 py-2 max-w-[85%] border border-white/5'">
                                {{ message.content }}
                            </div>
                        </div>
                    }
                </div>

                <div class="sticky bottom-0  backdrop-blur-lg  ">
                    <div class="flex gap-2 w-full   rounded-2xl p-2 shadow-2xl focus-within:border-blue-500 transition-all">
                        <input pInputText type="text" [(ngModel)]="inputMessage" (keydown.enter)="sendMessage()" placeholder="Escribe un mensaje..." class="flex-1  px-3 outline-none" />
                        <p-button  (click)="this.scroll()" class="rounded-xl font-semibold transition-colors"> Enviar </p-button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ChatComponent implements OnInit {
    title = input<string>();

    // Referencia al contenedor de scroll
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    messages: ChatMessage[] = [{ id: 1, role: 'ai', content: 'Hola 👋 ¿En qué puedo ayudarte hoy?' }];

    inputMessage = '';

    ngOnInit() {
        this.scrollToTop();
    }

    scroll() {
        this.scrollToTop();
    }

    sendMessage() {
        if (!this.inputMessage.trim()) return;

        this.messages.push({
            id: Date.now(),
            role: 'user',
            content: this.inputMessage
        });

        const userText = this.inputMessage;
        this.inputMessage = '';

        // Simulación IA
        setTimeout(() => {
            this.messages.push({
                id: Date.now() + 1,
                role: 'ai',
                content: `Recibí tu mensaje: "${userText}". Estoy procesando... 🤖`
            });
        }, 600);
        this.scrollToTop();
    }

    scrollToTop(): void {
        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }
}
