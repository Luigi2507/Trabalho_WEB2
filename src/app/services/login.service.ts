import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const CHAVE: string = 'usuarioLogado';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private platformId = inject(PLATFORM_ID);

    //retorna usuario logado ou null se ninguem logou
    public get usuarioLogado(): any {
        if (!isPlatformBrowser(this.platformId)) return null;
        const usu = sessionStorage.getItem(CHAVE);
        return usu ? JSON.parse(usu) : null;
    }
    public set usuarioLogado(usuario: any) {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.setItem(CHAVE, JSON.stringify(usuario));
    }
    logout(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.removeItem(CHAVE);
    }
    temPerfil(...perfis: string[]): boolean {
        const usu = this.usuarioLogado;
        return usu != null && perfis.includes(usu.perfil);
    }
}
