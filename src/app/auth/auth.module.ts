// src/app/auth/auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { LoginComponent } from '../components/login/login';
import { RegisterComponent } from './components/register/register';
import { AuthService } from './services/auth';
import { AuthGuard} from '@/auth/guards/auth.guard';
import { AuthInterceptor} from '@/auth/interceptors/auth.interceptor';

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ])
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),

        AuthService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    exports: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
