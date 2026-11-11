import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { PERFIL } from '../shared'

const HOME_PERFIL: Record<string, string> = {
  [PERFIL.FUNCIONARIO]: '/solicitacaoFuncionario/listar',
  [PERFIL.CLIENTE]: '/solicitacaoCliente/listar'
};

export const authGuard: CanActivateFn = (route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const loginService = inject(LoginService);
  const router = inject(Router);
  const usuarioLogado = loginService.usuarioLogado();

  if(!usuarioLogado) {
    return router.createUrlTree(['/login'], {
      queryParams: {error: 'Faça Login para acessar esta página.'}
    })
  }
  
  const role: string | undefined = route.data?.['role'];

  if (role && role !== usuarioLogado.perfil) {
    const home = HOME_PERFIL[usuarioLogado.perfil] ?? '/home';
    return router.createUrlTree([home]);
  }

  return true;
};
