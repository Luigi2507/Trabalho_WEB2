import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Usuario, Login } from '../shared';

const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    BASE_URL_API = "http://localhost:8080";
    BASE_URL_CLIENTES = "http://localhost:3000/clientes";
    BASE_URL_FUNCIONARIOS = "http://localhost:3000/funcionarios";
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    private browser = isPlatformBrowser(inject(PLATFORM_ID));
    private httpClient = inject(HttpClient);

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

        return this.httpClient.post<Usuario>(
            this.BASE_URL_API + "/login",
            JSON.stringify(login),
            this.httpOptions
        ).pipe(
            map(u => new Usuario(u.id, u.nome, u.login, u.perfil, u.cpf ?? '')),
            catchError((erro: HttpErrorResponse) =>
                erro.status === 401 ? of(null) : throwError(() => erro)
            )
        );
    }

    redefinirSenha(email: string): Observable<string | null> {
        const novaSenha = Math.floor(1000 + Math.random() * 9000).toString();
        const alvo = email.trim().toLowerCase();

        const tentar = (baseUrl: string): Observable<string | null> =>
            this.httpClient.get<any[]>(baseUrl, this.httpOptions).pipe(
                switchMap(lista => {
                    const item = lista.find(i => i.email && i.email.toLowerCase() === alvo);
                    if (!item) return of(null);
                    item.senha = novaSenha;
                    return this.httpClient
                        .put(baseUrl + "/" + item.id, JSON.stringify(item), this.httpOptions)
                        .pipe(map(() => novaSenha));
                })
            );

        return tentar(this.BASE_URL_CLIENTES).pipe(
            switchMap(s => (s ? of(s) : tentar(this.BASE_URL_FUNCIONARIOS)))
        );
    }
}