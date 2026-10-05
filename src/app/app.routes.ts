
import { Routes } from '@angular/router';
import { Cadastro } from './cadastro/cadastro';
import { Contato } from './contato/contato';
import { Home } from './home/home';
import { Login } from './login/login';
import { Sobre } from './sobre/sobre';
import { ClienteInserirSolicitacaoComponent } from './solicitacaoCliente/cliente-inserir-solicitacao/cliente-inserir-solicitacao.component';
import { ClienteListarSolicitacaoComponent } from './solicitacaoCliente/cliente-listar-solicitacao/cliente-listar-solicitacao.component';
import { ClienteOrcamentoSolicitacaoComponent } from './solicitacaoCliente/cliente-orcamento-solicitacao/cliente-orcamento-solicitacao.component';
import { ClientePagarSolicitacaoComponent } from './solicitacaoCliente/cliente-pagar-solicitacao/cliente-pagar-solicitacao.component';
import { ClienteVisualizarSolicitacaoComponent } from './solicitacaoCliente/cliente-visualizar-solicitacao/cliente-visualizar-solicitacao.component';
import { FuncionarioListarSolicitacaoComponent } from './solicitacaoFuncionario/funcionario-listar-solicitacao/funcionario-listar-solicitacao.component';
import { FuncionarioManutencaoSolicitacaoComponent } from './solicitacaoFuncionario/funcionario-manutencao-solicitacao/funcionario-manutencao-solicitacao.component';
import { FuncionarioOrcamentoSolicitacaoComponent } from './solicitacaoFuncionario/funcionario-orcamento-solicitacao/funcionario-orcamento-solicitacao.component';
import { ListarFuncionarioComponent } from './funcionarios/listar-funcionario/listar-funcionario.component';
import { InserirFuncionarioComponent } from './funcionarios/inserir-funcionario/inserir-funcionario.component';
import { EditarFuncionarioComponent } from './funcionarios/editar-funcionario/editar-funcionario.component';
import { RelatorioComponent } from './solicitacaoFuncionario/relatorio/relatorio.component';
import { ListarCategoriaEquipamentoComponent } from './categoria-equipamento/listar-categoria-equipamento/listar-categoria-equipamento.component';
import { InserirCategoriaEquipamentoComponent } from './categoria-equipamento/inserir-categoria-equipamento/inserir-categoria-equipamento.component';
import { EditarCategoriaEquipamentoComponent } from './categoria-equipamento/editar-categoria-equipamento/editar-categoria-equipamento.component';
import { authGuard } from './auth';

export const routes: Routes = [

  //Rotas das páginas principais
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

  //Rotas das páginas CRUD de funcionários
  {
    path: 'funcionarios/listar',
    component: ListarFuncionarioComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  {
    path: 'funcionarios/novo',
    component: InserirFuncionarioComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  {
    path: 'funcionarios/editar/:id',
    component: EditarFuncionarioComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },

  {
    path: 'solicitacaoCliente',
    redirectTo: 'solicitacaoCliente/listar',
    pathMatch: 'full'
  },
  {
    path: 'solicitacaoCliente/listar',
    component: ClienteListarSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'CLIENTE'}
  },
  {
    path: 'solicitacaoCliente/nova',
    component: ClienteInserirSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'CLIENTE'}
  },
  {
    path: 'solicitacaoCliente/visualizar/:id',
    component: ClienteVisualizarSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'CLIENTE'}
  },
  {
    path: 'solicitacaoCliente/orcamento/:id',
    component: ClienteOrcamentoSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'CLIENTE'}
  },
  {
    path: 'solicitacaoCliente/pagar/:id',
    component: ClientePagarSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'CLIENTE'}
  },
  {
    path: 'solicitacaoFuncionario/listar',
    component: FuncionarioListarSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  {
    path: 'solicitacaoFuncionario/orcamento/:id',
    component: FuncionarioOrcamentoSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  {
    path: 'solicitacaoFuncionario/manutencao/:id',
    component: FuncionarioManutencaoSolicitacaoComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  {
    path:'relatorios',
    component: RelatorioComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  { 
    path: 'categorias/listar', 
    component: ListarCategoriaEquipamentoComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'} 
  },
  { 
    path: 'categorias/novo', 
    component: InserirCategoriaEquipamentoComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  { 
    path: 'categorias/editar/:id', 
    component: EditarCategoriaEquipamentoComponent,
    canActivate: [authGuard],
    data: { role: 'FUNCIONARIO'}
  },
  
];