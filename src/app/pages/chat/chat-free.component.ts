import { Component, OnInit, input, ViewChild, ElementRef, AfterViewChecked, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatIAInterface, ChatIaService } from '@/pages/service/chat-ia.service';
import { MarkdownComponent } from 'ngx-markdown';
import { TemarioService } from '@/pages/service/temario.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

interface ChatMessage {
    id: number;
    role: 'user' | 'ai';
    content: string;
    loading?: boolean
}

@Component({
    selector: 'app-free-chat',
    standalone: true,
    imports: [FormsModule, Button, InputText, Toolbar, MarkdownComponent, RouterLink, Toast],
    template: `
        <p-toast />
        <div class="relative min-h-[calc(90vh-4rem)] text-white flex justify-center" #scrollContainer>
            <div class="w-full max-w-3xl flex flex-col min-h-full">
                <div class="sticky top-0 z-50  backdrop-blur-md">
                    <p-toolbar styleClass="bg-transparent border-none py-3">
                        <ng-template #start>
                            <!--                            <a routerLink="/dashboard/guia" pButtonIcon="pi pi-arrow-left" ></a>-->
                            <p-button routerLink="/dashboard/free" icon="pi pi-arrow-left" severity="secondary"
                                      [text]="true" />
                        </ng-template>

                        <ng-template #center>
                            <div
                                class="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 rounded-full">
                                <i class="pi pi-microchip-ai text-blue-400"></i>
                                <span class="font-bold text-sm tracking-wide">Codementor</span>
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
                                @if (message.loading) {
                                    <div class="flex items-center gap-2 text-sm text-neutral-400 animate-pulse">
                                        <i class="pi pi-spin pi-spinner"></i>
                                        <span>Pensando...</span>
                                    </div>
                                } @else {
                                    <div class="markdown-container prose prose-invert max-w-none">
                                        <markdown [data]="message.content"></markdown>
                                    </div>

                                    <div class="flex justify-end mt-2 pt-2 border-t border-white/5">
                                        <button
                                            (click)="copyToClipboard(message.content)"
                                            class="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 text-xs">
                                            <i class="pi pi-copy"></i>
                                            <span>Copiar</span>
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>

                <div class="sticky bottom-0 z-50 backdrop-blur-lg bg-neutral-950/50">
                    <div class="flex gap-2 w-full p-4">
                        <input pInputText type="text" [(ngModel)]="inputMessage" (keydown.enter)="sendMessage()"
                               placeholder="Escribe un mensaje..." class="flex-1 px-3 outline-none rounded-xl" />
                        <p-button (onClick)="sendMessage()" icon="pi pi-send" label="Enviar"
                                  styleClass="rounded-xl"></p-button>

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
    `,
    providers: [MessageService]
})
export class ChatComponent implements OnInit {
    visible: boolean = false;
    private route = inject(ActivatedRoute);
    title: string = 'Cargando...';
    idTemaConversacion: string | null = null;
    idConversacionMongo: string | null = null;
    idUsuario: string = localStorage.getItem('idUser')!;
    waitingForResponse = false;
    chatModel: ChatIAInterface | null = null;
    modeLearning: string = 'Libre';





    onload: boolean = true;

    // Referencia al contenedor de scroll
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    messages: ChatMessage[] = [{ id: 1, role: 'ai', content: 'Hola 👋  \n' + 'Estoy aquí para ayudarte a aprender.  \n' + '¿En qué puedo ayudarte hoy?\n' }];

    inputMessage = '';

    constructor(
        private chatIaService: ChatIaService,
        private temarioService: TemarioService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.scrollToTop();
        this.conversacion();
    }

    scroll() {
        this.scrollToTop();
    }

    copyToClipboard(text: string) {
        if (!text) {
            console.warn('Texto vacío');
            return;
        }
        // Usar la API moderna del portapapeles
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // Opcional: Podrías añadir un mensaje de confirmación (Toast)
                this.copiedSuccess();

                // Si usas PrimeNG MessageService:
                // this.messageService.add({severity:'success', summary:'Copiado', detail:'Respuesta copiada al portapapeles'});
            })
            .catch((err) => {
                this.copiedError()
                console.error('Error al copiar: ', err);
            });
    }

    createChatModel(messageUser: string): ChatIAInterface {
        // Lógica para crear o inicializar el modelo de chat IA

        this.chatModel = {
            idConversationMain: this.idConversacionMongo || '',
            message: messageUser,
            userId: this.idUsuario,
            idTemaConversacion: this.idTemaConversacion!,
            mode: this.modeLearning
        };

        return this.chatModel;
    }

    sendMessage() {
        if (!this.inputMessage.trim()) return;

        // 1. Mensaje del usuario
        this.messages.push({
            id: Date.now(),
            role: 'user',
            content: this.inputMessage
        });

        const userText = this.inputMessage;
        this.inputMessage = '';

        // 2. Mensaje temporal de la IA
        const loadingMessageId = Date.now() + 1;

        this.messages.push({
            id: loadingMessageId,
            role: 'ai',
            content: 'Escribiendo...',
            loading: true
        });

        this.scrollToTop();

        const chatEsteban = this.createChatModel(userText);

        // 3. Llamada al backend
        this.chatIaService.chatFree(chatEsteban).subscribe({
            next: (chat) => {
                const respuestaIA = chat.text || 'Lo siento, no tengo una respuesta en este momento.';

                // 4. Reemplazar el mensaje "cargando"
                const index = this.messages.findIndex(m => m.id === loadingMessageId);

                if (index !== -1) {
                    this.messages[index] = {
                        id: loadingMessageId,
                        role: 'ai',
                        content: respuestaIA
                    };
                }

                this.idConversacionMongo = chat.idConversationMain;
                this.scrollToTop();
            },
            error: () => {
                // 5. Error → reemplazar loading
                const index = this.messages.findIndex(m => m.id === loadingMessageId);

                if (index !== -1) {
                    this.messages[index] = {
                        id: loadingMessageId,
                        role: 'ai',
                        content: '⚠️ Ocurrió un error al obtener la respuesta.'
                    };
                }
            }
        });
    }


    conversacion() {
        this.chatIaService.getConversationByTemaAndUsuario(this.idTemaConversacion!, this.idUsuario, this.modeLearning).subscribe((historial) => {
            this.title = historial.title;
            this.idConversacionMongo = historial._id;

            this.messages = [
                {
                    id: 1,
                    role: 'ai',
                    content: `Hola 👋
Estoy aquí para ayudarte a aprender.
¿En qué puedo ayudarte hoy?
        `
                },
                ...this.mapConversationToMessages(historial)
            ];
        });

        this.scrollToTop();
    }

    copiedSuccess() {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Mensaje copiado exitosamente.' });
    }

    copiedError() {
        this.messageService.add({ severity: 'warn', summary: 'Info', detail: 'El mensaje no se ha podido copiar.' });
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

    show(message: string, severity: string) {
        this.messageService.add({ severity: `${severity}`, summary: 'Info', detail: `${message}`, life: 3000 });
    }
}
