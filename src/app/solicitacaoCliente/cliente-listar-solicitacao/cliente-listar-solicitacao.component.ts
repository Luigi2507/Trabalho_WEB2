import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoItem, Solicitacao } from '../../shared/models/solicitacao.model';

@Component({
  selector: 'app-cliente-listar-solicitacao',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './cliente-listar-solicitacao.component.html',
  styleUrl: './cliente-listar-solicitacao.component.css',
})

export class ClienteListarSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private router = inject(Router);

  solicitacoes: Solicitacao[] = [];

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  //busca e mostra somente as solicitaçoes do cliente logado
  carregarSolicitacoes(): void {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    const cpfCliente = usuarioLogado.cpf;
  
    this.solicitacoes = this.solicitacaoService.listarTodos().filter(solicitacao => solicitacao.clienteCpf === cpfCliente).sort((a, b) => { //organiza as solicitacoes em ordem decrescente
      const dataA = a.dataHora instanceof Date ? a.dataHora.getTime() : new Date(a.dataHora).getTime();
      const dataB = b.dataHora instanceof Date ? b.dataHora.getTime() : new Date(b.dataHora).getTime();
      return dataA - dataB;
    });
  }

  descricaoResumida(descricao: string): string {
    if (!descricao) return '';
    return descricao.length > 30 ? descricao.substring(0, 30) + "..." : descricao;
  }

  //define qual acao o cliente pode realizar de acordo com o status da solicitacao
  textoBotaoAcao(status: string): string {
    switch (status) {
      case 'ORCADA':
        return 'Aprovar/Rejeitar Orçamento';
      case 'REJEITADA':
        return 'Resgatar Serviço';
      case 'ARRUMADA':
        return 'Pagar Serviço';
      default:
        return '';
    }
  }

  //direciona para a tela da acao disponivel
  navegarParaAcao(solicitacao: Solicitacao): void {
    switch (solicitacao.status) {
      case 'ORCADA':
        this.router.navigate(['/solicitacaoCliente/orcamento', solicitacao.id]);
        break;
      case 'ARRUMADA':
        this.router.navigate(['/solicitacaoCliente/pagar', solicitacao.id]);
        break;
      default:
        this.router.navigate(['/solicitacaoCliente/visualizar', solicitacao.id]);
        break;
    }
  }

  resgatar($event: any, solicitacao: Solicitacao): void {
    $event.preventDefault();
    if (confirm(`Deseja resgatar a solicitação "${solicitacao.descricaoEquipamento}"?`)) {
      solicitacao.status = 'APROVADA';
      solicitacao.historico.push(
        new HistoricoItem(new Date(), 'APROVADA', 'Cliente (resgate)')
      );
      this.solicitacaoService.atualizar(solicitacao);
      this.solicitacoes = this.solicitacaoService.listarTodos().sort((a, b) =>
        new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }
  }

  sair($event: any): void {
    $event.preventDefault();
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}