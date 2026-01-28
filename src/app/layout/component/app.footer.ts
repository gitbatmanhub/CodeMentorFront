import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Codementor by
        <a href="/"  rel="noopener noreferrer" class="text-primary font-bold hover:underline">Edwin y Liccy</a>
    </div>`
})
export class AppFooter {}
