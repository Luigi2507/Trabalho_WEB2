import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoItem, Solicitacao } from '../../shared/models/solicitacao.model';

@Component({
  selector: 'app-cliente-visualizar-solicitacao',
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-visualizar-solicitacao.component.html',
  styleUrl: './cliente-visualizar-solicitacao.component.css',
})
export class ClienteVisualizarSolicitacaoComponent implements OnInit{
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);

  solicitacao: Solicitacao | undefined;
  
  ngOnInit(): void {
      const id = +this.route.snapshot.params['id'];
    this.solicitacao = this.solicitacaoService.buscarPorID(id);

    if (this.solicitacao === undefined) {
      throw new Error("Solicitação não encontrada: id = " + id);
    }
  }

  textoBotaoAcao(status: string): string {
      switch (status) {
        case 'ORCADA': 
          return 'Aprovar/Rejeitar Serviço';
        case 'REJEITADA': 
          return 'Resgatar Serviço';
        case 'ARRUMADA': 
          return 'Pagar Serviço';
        default: 
          return '';
      }
    }

    rotaBotaoAcao(status: string): string {
      switch (status) {
        case 'ORCADA': 
          return '/solicitacaoCliente/orcamento';
        case 'ARRUMADA': 
          return '/solicitacaoCliente/pagar';
        default: 
          return '/solicitacaoCliente/visualizar';
      }
    }

    simularConclusao(): void {
      if (!this.solicitacao) return;
      this.solicitacao.status = 'ARRUMADA';
      this.solicitacao.historico.push(
        new HistoricoItem(new Date(), 'ARRUMADA', 'Funcionário')
      );
      this.solicitacaoService.atualizar(this.solicitacao);
    }
}
