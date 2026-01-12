import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
    id: number;
    role: 'user' | 'ai';
    content: string;
}



@Component({
    selector: 'app-chat',
    template: `
        <div class="card">

            <div class="h-screen flex flex-col items-center  text-white">

                <!-- CONTENEDOR CHAT -->
                <div class="flex-1 w-full flex justify-center overflow-hidden">

                    <div
                        class="w-full max-w-2xl px-4 py-6 overflow-y-auto space-y-4"
                    >

                        @for (message of messages; track message.id) {

                            <!-- MENSAJE USUARIO -->
                            @if (message.role === 'user') {
                                <div class="flex justify-end">
                                    <div class="bg-blue-600 text-white rounded-xl px-4 py-2 max-w-[80%]">
                                        {{ message.content }}
                                    </div>
                                </div>
                            }

                            <!-- MENSAJE IA -->
                            @if (message.role === 'ai') {
                                <div class="flex justify-start">
                                    <div class="bg-neutral-800 rounded-xl px-4 py-2 max-w-[80%]">
                                        {{ message.content }}
                                    </div>
                                </div>
                            }

                        }

                    </div>
                </div>

                <!-- INPUT FIJO ABAJO -->
                <div class="w-full flex justify-center border-t border-white/10 ">
                    <div class="w-full max-w-2xl px-4 py-4">

                        <div class="flex gap-2">
                            <input
                                type="text"
                                [(ngModel)]="inputMessage"
                                placeholder="Escribe tu mensaje..."
                                class="flex-1 rounded-lg bg-neutral-900 border border-white/10 px-4 py-2 outline-none focus:border-blue-500"
                            />

                            <button
                                (click)="sendMessage()"
                                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                                Enviar
                            </button>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    `,
    imports: [
        FormsModule
    ],
    standalone: true
})
export class ChatComponent implements OnInit {
    title = input<string>();

    messages: ChatMessage[] = [
        {
            id: 1,
            role: 'ai',
            content: 'Hola 👋 ¿En qué puedo ayudarte hoy?'
        }
    ];

    inputMessage = '';


    constructor() {}

    ngOnInit() {
        console.log('ChatComponent initialized with title:', this.title);
    }

    sendMessage() {
        if (!this.inputMessage.trim()) return;

        this.messages.push({
            id: Date.now(),
            role: 'user',
            content: this.inputMessage
        });

        // Simulación IA
        setTimeout(() => {
            this.messages.push({
                id: Date.now() + 1,
                role: 'ai',
                content: 'Estoy procesando tu mensaje 🤖'
            });
        }, 600);

        this.inputMessage = '';
}
}
