import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BackendLoginResponse, LoginCredentials, RegisterColab, RegisterCredentials, UpdateUser, UserInterface } from '../models/auth.models';
import { environment } from '../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser: Observable<UserInterface | null>;
    private apiUrl = `${environment.apiUrl}/auth`;
    private apiUrlColab = `${environment.apiUrl}/colaborador/user/`;
    private apiUrlColaborador = `${environment.apiUrl}/colaborador/`;
    private currentUserSubject: BehaviorSubject<UserInterface | null>;
    private roles: string[] = [];

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        let initialUser: UserInterface | null = null;
        const storedUser = localStorage.getItem('currentUser');
        const rolesStr = localStorage.getItem('roles');
        if (rolesStr) {
            try {
                this.roles = JSON.parse(rolesStr);
            }catch (e) {
                console.log('Error parsing roles from localStorage:', e);
            }
        }


        if (storedUser) {
            try {
                initialUser = JSON.parse(storedUser);
            } catch (e) {
                console.error('Error parsing stored user:', e);
                localStorage.removeItem('currentUser');
            }
        }

        this.currentUserSubject = new BehaviorSubject<UserInterface | null>(initialUser);
        this.currentUser = this.currentUserSubject.asObservable();

        // Validar token al iniciar servicio
        const token = this.getToken();
        if (token && this.isTokenExpired(token)) {
            this.logout();
        }
    }

    public get currentUserValue(): UserInterface | null {
        return this.currentUserSubject.value;
    }

    login(credentials: LoginCredentials): Observable<BackendLoginResponse> {
        return this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap((res) => {
               this.setLocalStorageForColab(res)
            }),
            catchError((error) => {
                console.log(error);
                console.log(error.error.message);
                return throwError(() => error);
            })
        );
    }

    UpdateUser(idUser: string, user: UpdateUser): Observable<BackendLoginResponse> {
        return this.http.patch<BackendLoginResponse>(`${this.apiUrl}/updateUser/${idUser}`, user).pipe(
            tap((res) => {
                return res;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    register(credentials: RegisterCredentials): Observable<BackendLoginResponse> {
        return this.http.post<BackendLoginResponse>(`${this.apiUrl}/register`, credentials).pipe(
            tap((res) => {
                this.setLocalStorageForColab(res)
            }),
            catchError((error) => {
                console.error('Register failed:', error);
                return of(error);
            })
        );
    }


    setLocalStorageForColab(res: BackendLoginResponse) {
        const user: UserInterface = {
            fullName: res.fullName,
            email: res.email,
            idUser: res.idUser,
            encuestado: res.encuesta,
        };
        console.log('Login successful, storing user data:', user, 'with roles:', res.role);
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userName', user.fullName);
        localStorage.setItem('encuestado', String(res.encuesta));
        localStorage.setItem('roles', JSON.stringify(res.role));
        this.roles = res.role;
        this.currentUserSubject.next(user);
    }


    removeUser(idUsuario: string, idColaborador: string) {
        return this.http.get(`${this.apiUrl}/removeUser/${idUsuario}/${idColaborador}`).pipe(
            tap((res) => {
                return res;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    searchUserById(idUser: string): Observable<UserInterface> {
        return this.http.get<UserInterface>(`${this.apiUrl}/${idUser}`).pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

    searchDataColab(idColab: string): Observable<UserInterface> {
        return this.http.get<UserInterface>(`${this.apiUrlColaborador}/${idColab}`).pipe(
            tap((res) => {
                return res;
            }),
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }



    getIdUser(): string | null {
        const token = this.getToken();
        if (token) {
            const payload = this.parseJwt(token);
            return payload?.id || null;
        }
        return null;
    }


    logout(): void {
        localStorage.clear();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    getEncuestado(): string | null {
        return localStorage.getItem('encuestado');
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    hasRole(role: string | string[]): boolean {
        if (Array.isArray(role)) {
            return role.some((r) => this.roles.includes(r));
        } else {
            return this.roles.includes(role);
        }
    }

    getRoles(): string[] {
        return this.roles;
    }

    isTokenExpired(token: string): boolean {
        const payload = this.parseJwt(token);
        if (!payload || !payload.exp) return true;

        const now = Math.floor(Date.now() / 1000); // segundos
        return payload.exp < now;
    }

    getTokenPayload(): any {
        const token = this.getToken();
        return token ? this.parseJwt(token) : null;
    }

    private parseJwt(token: string): any {
        try {
            const base64Payload = token.split('.')[1];
            const payload = atob(base64Payload);
            const parsed = JSON.parse(payload);
            if (parsed?.id) {
                localStorage.setItem('idUser', parsed.id);
            }
            return JSON.parse(payload);
        } catch (e) {
            return null;
        }
    }
}
