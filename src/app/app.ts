import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  private loginService = inject(LoginService);

  readonly usuarioLogado = this.loginService.usuarioLogado;

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  temPermissao(...perfis: string[]) : boolean {
    let usu = this.usuarioLogado();
    return !!usu && perfis.includes(usu.perfil);
  }
}