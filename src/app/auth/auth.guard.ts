import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FuncionarioOrcamentoSolicitacaoComponent } from '../solicitacaoFuncionario/funcionario-orcamento-solicitacao/funcionario-orcamento-solicitacao.component';

const HOME_PERFIL: Record<string, string> = {
  FUNCIONARIO: '/solicitacaoFuncionario/listar',
  CLIENTE: '/solicitacaoCliente/listar'
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
