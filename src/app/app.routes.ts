import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { Home } from './home/home';
import { Contato } from './contato/contato';
import { Sobre } from './sobre/sobre';
import { FuncionarioHome } from './funcionario-home/funcionario-home';    
import { ClienteInserirSolicitacaoComponent } from './solicitacaoCliente/cliente-inserir-solicitacao/cliente-inserir-solicitacao.component';
import { ClienteListarSolicitacaoComponent } from './solicitacaoCliente/cliente-listar-solicitacao/cliente-listar-solicitacao.component';
import { ClienteOrcamentoSolicitacaoComponent } from './solicitacaoCliente/cliente-orcamento-solicitacao/cliente-orcamento-solicitacao.component';
import { ClientePagarSolicitacaoComponent } from './solicitacaoCliente/cliente-pagar-solicitacao/cliente-pagar-solicitacao.component';
import { ClienteVisualizarSolicitacaoComponent } from './solicitacaoCliente/cliente-visualizar-solicitacao/cliente-visualizar-solicitacao.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'cadastro',
    component: Cadastro
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'contato',
    component: Contato
  },
  {
    path: 'sobre',
    component: Sobre
  },

  {
    path: 'solicitacaoCliente',
    redirectTo: 'solicitacaoCliente/listar',
    pathMatch: 'full'
  },
  {
    path: 'solicitacaoCliente/listar',
    component: ClienteListarSolicitacaoComponent
  },
  {
    path: 'solicitacaoCliente/nova',
    component: ClienteInserirSolicitacaoComponent
  },
  {
    path: 'solicitacaoCliente/visualizar/:id',
    component: ClienteVisualizarSolicitacaoComponent
  },
  {
    path: 'solicitacaoCliente/orcamento/:id',
    component: ClienteOrcamentoSolicitacaoComponent
  },
  {
    path: 'solicitacaoCliente/pagar/:id',
    component: ClientePagarSolicitacaoComponent
  },
];