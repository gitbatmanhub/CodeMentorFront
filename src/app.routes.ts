import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from '@/pages/landing/landing';
import { Notfound } from '@/pages/notfound/notfound';
// import { RegisterComponent } from '@/auth/components/register/register';
import { Login } from '@/pages/auth/login';
import { AuthGuard } from '@/auth/guards/auth.guard';

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

        ],


    },


    { path: 'notfound', component: Notfound },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
