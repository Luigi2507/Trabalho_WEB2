import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

import { LoginService } from './services/login.service';
import { Usuario } from './shared/models/usuario.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  private loginService = inject(LoginService);

  get usuarioLogado() : Usuario | null {
    return this.loginService.usuarioLogado;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  temPermissao(...perfis: string[]) : boolean {
    let usu = this.usuarioLogado;

    if (usu != null && perfis.length > 0) {
      for (let p of perfis) {
        if (usu.perfil.indexOf(p) != -1) {
          return true;
        }
      }
    }
    return false;
  }
}