import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Usuario, Login } from '../shared';

const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private browser = isPlatformBrowser(inject(PLATFORM_ID));

    //retorna usuario logado ou null se ninguem logou
    get usuarioLogado(): Usuario | null {
        if (!this.browser) return null;
        const usu = sessionStorage.getItem(LS_CHAVE);
        return usu ? JSON.parse(usu) : null;
    }

    set usuarioLogado(usuario: Usuario) {
        if (this.browser) sessionStorage.setItem(LS_CHAVE, JSON.stringify(usuario));
    }

    logout() {
        if (this.browser) sessionStorage.removeItem(LS_CHAVE);
    }

    login(login: Login): Observable<Usuario | null> {
        if (!this.browser) return of(null);

        const clientes = JSON.parse(localStorage.getItem('clientes') ?? '[]');
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios') ?? '[]');

        const cliente = clientes.find((c: any) => c.email === login.login && c.senha === login.senha);
        if (cliente) return of(new Usuario(cliente.id, cliente.nome, cliente.email, 'CLIENTE', cliente.cpf));

        const func = funcionarios.find((f: any) => f.email === login.login && f.senha === login.senha);
        if (func) return of(new Usuario(func.id, func.nome, func.email, 'FUNCIONARIO'));

        return of(null);
     }
}
