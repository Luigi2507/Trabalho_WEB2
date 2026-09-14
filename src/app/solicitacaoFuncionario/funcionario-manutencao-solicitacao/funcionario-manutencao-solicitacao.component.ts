import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { HistoricoItem, Solicitacao } from '../../shared/models/solicitacao.model';
import { Funcionario } from '../../shared/models/funcionario.model';

@Component({
  selector: 'app-funcionario-manutencao-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './funcionario-manutencao-solicitacao.component.html',
  styleUrl: './funcionario-manutencao-solicitacao.component.css',
})

export class FuncionarioManutencaoSolicitacaoComponent implements OnInit{
  private solicitacaoService = inject(SolicitacaoService)
  private funcionarioService = inject(FuncionarioService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  solicitacao: Solicitacao | undefined
  funcionarioLogado: any = null

  modo: 'manutencao' | 'redirecionar' = 'manutencao';

  descricaoManutencao: string = '';
  orientacoesCliente: string = '';

  funcionariosDisponiveis: Funcionario[] = [];
  funcionarioDestinoId: number = 0;


  efetuarManutencao(): void {
    if (!this.solicitacao) return;
    if (!this.descricaoManutencao.trim() || !this.orientacoesCliente.trim()) return;

    this.solicitacao.status = 'ARRUMADA';
    this.solicitacao.descricaoManutencao = this.descricaoManutencao;
    this.solicitacao.orientacoesCliente = this.orientacoesCliente;
    this.solicitacao.funcionarioManutencao = this.funcionarioLogado.nome;
    this.solicitacao.funcionarioAtual = this.funcionarioLogado.nome;
    
    if (!this.solicitacao.historico) {
      this.solicitacao.historico = [];
    }
    this.solicitacao.historico.push(new HistoricoItem(new Date(), 'ARRUMADA', `${this.funcionarioLogado.nome} (Funcionário)`));

    this.solicitacaoService.atualizar(this.solicitacao);
    this.router.navigate(['/solicitacaoFuncionario/listar']);
  }

  redirecionar(): void {
    if (!this.solicitacao || !this.funcionarioDestinoId) return;

    const destino = this.funcionariosDisponiveis.find(f => f.id === this.funcionarioDestinoId);
    if (!destino) return;

    this.solicitacao.status = 'REDIRECIONADA';
    this.solicitacao.funcionarioAtual = destino.nome;

    if (!this.solicitacao.historico) {
      this.solicitacao.historico = [];
    }
    
    this.solicitacao.historico.push(new HistoricoItem(new Date(), 'REDIRECIONADA',`${this.funcionarioLogado.nome} (Funcionário)`));
    this.solicitacaoService.atualizar(this.solicitacao);
    this.router.navigate(['/solicitacaoFuncionario/listar']);
  }
  
  ngOnInit(): void {
    this.funcionarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}');

    const id = +this.route.snapshot.params['id'];
    this.solicitacao = this.solicitacaoService.buscarPorID(id);

    if (this.solicitacao === undefined) {
      this.router.navigate(['/solicitacaoFuncionario/listar']);
      return;
    }

    this.funcionariosDisponiveis = this.funcionarioService.listarTodos().filter((f: Funcionario) => f.nome !== this.funcionarioLogado.nome);
  }
}
