// src/app/auth/auth.models.ts

export interface UserInterface {
    fullName: string;
    email: string;
    id?: string;
    role?: string[];
    idUser?: string;
    encuestado?: boolean;
    idColaborador?: string | null;
}

export interface BackendLoginResponse {
    fullName: string;
    email: string;
    token: string;
    role: string[];
    id: string;
    encuesta: boolean;
    codColaborador: string | null;
}

export interface AuthResponse {
    token: string;
    user: UserInterface;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    // Añade más propiedades para el registro
}

export interface Area {
    nameArea: string;
}

export interface RegisterColab {
    cedula: string;
    fullName: string;
    idEspecialidad: string;
    codColaborador: string;
}

/*export interface RegisterColabUpdate extends RegisterColab {
    password?: string;
    roles: string[];
}*/

export interface UpdateUser extends RegisterColab {
    password?: string;
    role: string[];
}
