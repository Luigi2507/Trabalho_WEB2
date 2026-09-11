
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
    component: ListarFuncionarioComponent
  },
  {
    path: 'funcionarios/inserir',
    component: InserirFuncionarioComponent
  },
  {
    path: 'funcionarios/editar/:id',
    component: EditarFuncionarioComponent
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
  {
    path: 'solicitacaoFuncionario/listar',
    component: FuncionarioListarSolicitacaoComponent
  },
  {
    path: 'solicitacaoFuncionario/orcamento/:id',
    component: FuncionarioOrcamentoSolicitacaoComponent
  },
  {
    path: 'solicitacaoFuncionario/manutencao/:id',
    component: FuncionarioManutencaoSolicitacaoComponent
  }
];