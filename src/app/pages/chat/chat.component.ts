import { Component, OnInit, input, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { Toolbar } from 'primeng/toolbar';
import { ActivatedRoute } from '@angular/router';
import { ChatIAInterface, ChatIaService } from '@/pages/service/chat-ia.service';
import { MarkdownComponent } from 'ngx-markdown';
import { TemarioService } from '@/pages/service/temario.service';

interface ChatMessage {
    id: number;
    role: 'user' | 'ai';
    content: string;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, Button, InputText, Toolbar, MarkdownComponent],
    template: `
        <div class="relative min-h-[calc(90vh-4rem)] text-white flex justify-center" #scrollContainer>
            <div class="w-full max-w-3xl flex flex-col min-h-full">
                <div class="sticky top-0 z-50  backdrop-blur-md">
                    <p-toolbar styleClass="bg-transparent border-none py-3">
                        <ng-template #start>
                            <p-button icon="pi pi-print" severity="secondary" [text]="true" />
                        </ng-template>

                        <ng-template #center>
                            <div class="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 rounded-full">
                                <i class="pi pi-microchip-ai text-blue-400"></i>
                                <span class="font-bold text-sm tracking-wide">{{ this.title }}</span>
                            </div>
                        </ng-template>

                        <ng-template #end>
                            <p-button icon="pi pi-download" severity="secondary" [text]="true" />
                        </ng-template>
                    </p-toolbar>
                </div>

                <div class="flex-1 px-4 py-8 space-y-6">
                    @for (message of messages; track message.id) {
                        <div [class]="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
                            <div [class]="message.role === 'user' ? 'bg-blue-600 rounded-2xl px-4 py-2 max-w-[85%]' : 'bg-neutral-800 rounded-2xl px-4 py-3 max-w-[85%] border border-white/5 relative group'">
                                @if (message.role === 'ai') {
                                    <div class="markdown-container prose prose-invert max-w-none">
                                        <markdown [data]="message.content"></markdown>
                                    </div>

                                    <div class="flex justify-end mt-2 pt-2 border-t border-white/5">
                                        <button (click)="copyToClipboard(message.content)" class="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 text-xs">
                                            <i class="pi pi-copy"></i> <span>Copiar</span>
                                        </button>
                                    </div>
                                } @else {
                                    <span class="whitespace-pre-wrap">{{ message.content }}</span>
                                }
                            </div>
                        </div>
                    }
                </div>

                <div class="sticky bottom-0 z-50 backdrop-blur-lg bg-neutral-950/50">
                    <div class="flex gap-2 w-full p-4">
                        <input pInputText type="text" [(ngModel)]="inputMessage" (keydown.enter)="sendMessage()" placeholder="Escribe un mensaje..." class="flex-1 px-3 outline-none rounded-xl" />
                        <p-button (onClick)="sendMessage()" label="Enviar" styleClass="rounded-xl"></p-button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: `
        /* 1. Evita que el texto normal se monte */
        .prose {
            line-height: 1.6;
            font-size: 0.95rem;
        }

        /* 2. Formato para bloques de código (triple backtick \`\`\`) */
        ::ng-deep .prose pre {
            background-color: #1e1e1e !important; /* Fondo oscuro */
            color: #d4d4d4;
            padding: 1.25rem;
            border-radius: 0.75rem;
            margin: 1rem 0;

            /* ESTO ARREGLA EL SCROLL Y LAS LETRAS MONTADAS */
            overflow-x: auto !important;
            white-space: pre !important;
            word-spacing: normal;
            word-break: normal;
        }

        /* 3. Fuente monoespaciada para que no cambie el tipo de letra */
        ::ng-deep .prose code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            font-size: 0.875em;
        }

        /* 4. Código en línea (single backtick \`) */
        ::ng-deep .prose :not(pre) > code {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 0.4rem;
            white-space: nowrap;
        }
    `
})
export class ChatComponent implements OnInit {
    private route = inject(ActivatedRoute);
    title: string = 'Cargando...';
    idTemaConversacion: string | null = null;
    idConversacionMongo: string | null = null;
    idUsuario: string = localStorage.getItem('idUser')!;
    waitingForResponse = false;
    chatModel: ChatIAInterface | null = null;
    onload: boolean = true;

    // Referencia al contenedor de scroll
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    messages: ChatMessage[] = [{ id: 1, role: 'ai', content: 'Hola 👋  \n' + 'Estoy aquí para ayudarte a aprender.  \n' + '¿En qué puedo ayudarte hoy?\n' }];

    inputMessage = '';

    constructor(
        private chatIaService: ChatIaService,
        private temarioService: TemarioService
    ) {}

    ngOnInit() {
        this.scrollToTop();
        this.idTemaConversacion = this.route.snapshot.paramMap.get('idTemaConversacion');
        console.log(`El tema del chat es: ${this.idTemaConversacion}`);
        console.log(`El id usuario es: ${this.idUsuario}`);
        this.obtenertema(this.idTemaConversacion!);
        this.conversacion();
    }

    scroll() {
        this.scrollToTop();
    }

    copyToClipboard(text: string) {
        if (!text) return;

        // Usar la API moderna del portapapeles
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // Opcional: Podrías añadir un mensaje de confirmación (Toast)
                console.log('Texto copiado al portapapeles');

                // Si usas PrimeNG MessageService:
                // this.messageService.add({severity:'success', summary:'Copiado', detail:'Respuesta copiada al portapapeles'});
            })
            .catch((err) => {
                console.error('Error al copiar: ', err);
            });
    }

    createChatModel(messageUser: string): ChatIAInterface {
        // Lógica para crear o inicializar el modelo de chat IA

        this.chatModel = {
            // Inicialización del modelo
            idConversationMain: this.idConversacionMongo || '',
            message: messageUser,
            userId: this.idUsuario,
            idTemaConversacion: this.idTemaConversacion!,
            mode: 'Tutor'
        };

        return this.chatModel;
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

        const chatEsteban = this.createChatModel(userText);

        this.chatIaService.chat(chatEsteban).subscribe((chat) => {
            this.idConversacionMongo = chat.idConversationMain;
            const respuestaIA = chat.text || 'Lo siento, no tengo una respuesta en este momento.';
            // console.log(respuestaIA);
            this.messages.push({
                id: Date.now() + 1,
                role: 'ai',
                content: respuestaIA
            });
        });
        this.scrollToTop();
    }

    conversacion() {
        this.chatIaService.getConversationByTemaAndUsuario(this.idTemaConversacion!, this.idUsuario).subscribe((historial) => {
            this.title = historial.title;
            this.idConversacionMongo = historial._id;

            this.messages = [
                {
                    id: 1,
                    role: 'ai',
                    content: `Hola 👋
                Hoy vamos a aprender sobre **{{title}}**.
                ¿En qué puedo ayudarte hoy?
        `
                },
                ...this.mapConversationToMessages(historial)
            ];
        });

        this.scrollToTop();
    }

    obtenertema(idTema: string) {
        this.temarioService.getTema(idTema).subscribe((data) => {
            this.title = data.descripcion;
        });
    }

    scrollToTop(): void {
        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    mapConversationToMessages(conversation: any): ChatMessage[] {
        const messages: ChatMessage[] = [];

        if (!conversation?.messages?.length) return messages;

        conversation.messages.forEach((msg: any) => {
            if (msg.usuarioMessage) {
                messages.push({
                    id: Date.now() + Math.random(),
                    role: 'user',
                    content: msg.usuarioMessage
                });
            }

            if (msg.iaMessage) {
                messages.push({
                    id: Date.now() + Math.random(),
                    role: 'ai',
                    content: msg.iaMessage
                });
            }
        });

        return messages;
    }
}
