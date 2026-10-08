import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const loginService = inject(LoginService);
  const router = inject(Router);
  const usuarioLogado = loginService.usuarioLogado;
  const url = state.url;

  if(usuarioLogado) {
    const roles: string | undefined = route.data?.['role'];
    if (roles && roles.indexOf(usuarioLogado.perfil) === -1) {
      router.navigate(['/login'], {
        queryParams: { error: 'Você não tem permissão para acessar esta página.' }
      });
      return false;
    }
    return true;
  }
  
  router.navigate(['/login'], {
    queryParams: { error: 'Faça login para acessar esta página.'}
  });
  return false;
};
