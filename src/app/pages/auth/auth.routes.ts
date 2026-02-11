import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Register } from '@/pages/auth/register/register';

export default [
    { path: 'access', component: Access },
    { path: 'register', component: Register },
    { path: 'error', component: Error },
    { path: 'login', component: Login }
] as Routes;
