import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from '@/pages/landing/landing';
import { Notfound } from '@/pages/notfound/notfound';
// import { RegisterComponent } from '@/auth/components/register/register';
import { Login } from '@/pages/auth/login';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Aprendizajelibre } from '@/pages/empty/aprendizajelibre';
import { Aprendizajeguiado } from '@/pages/empty/aprendizajeguiado';
import { Proyectos } from '@/pages/empty/proyectos';
import { ProfileComponent } from '@/pages/profile/profile';
import { ChatComponent } from '@/pages/chat/chat.component';
import { ChatProject } from '@/pages/chat/chat-project.component';
import { Evaluaciones } from '@/pages/empty/evaluaciones';

export const appRoutes: Routes = [
    {path: '', component: Landing},
    { path: 'landing', component: Landing },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            {path: 'pages', loadChildren: () => import('./app/pages/pages.routes')},
            {path: 'free', component: Aprendizajelibre},
            {path: 'guia', component: Aprendizajeguiado},
            {path: 'proyectos', component: Proyectos },
            {path: 'evaluaciones', component: Evaluaciones },
            {path: 'proyectos/:idProyecto', component: ChatProject },
            {path: 'perfil', component: ProfileComponent },
            {path: 'chat/:idTemaConversacion', component: ChatComponent },

        ],


    },


    { path: 'notfound', component: Notfound },


    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
