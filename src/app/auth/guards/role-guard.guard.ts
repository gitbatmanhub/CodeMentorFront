import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(route: any): boolean {
        const expectedRoles = route.data['roles'] as string[];
        if (!expectedRoles || expectedRoles.length === 0) {
            return true;
        }
        const hasAccess = expectedRoles.some((role) => this.authService.hasRole(role));
        if (!hasAccess) {
            this.router.navigate(['/auth/access']);
            return false;
        }

        return true;
    }
}
