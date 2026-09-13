import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  private router = inject(Router);

  solicitacao: Solicitacao | undefined;
  
  ngOnInit(): void {
      const id = +this.route.snapshot.params['id'];
    this.solicitacao = this.solicitacaoService.buscarPorID(id);

    if (this.solicitacao === undefined) {
      throw new Error("Solicitação não encontrada: id = " + id);
    }
  }

// define botao de acordo com o status
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

  // qual pag o botao leva 
    rotaBotaoAcao(status: string): string {
        switch (status) {
          case 'ORCADA': return '/solicitacaoCliente/orcamento';
          case 'ARRUMADA': return '/solicitacaoCliente/pagar';

          default: return '';
        }
    }

    // cliente resgatar 
    resgatar(): void {
      if (!this.solicitacao) return;
      if (!confirm(`Deseja resgatar a solicitação "${this.solicitacao.descricaoEquipamento}"?`)) return;

      this.solicitacao.status = 'APROVADA';
      this.solicitacao.historico.push(
        new HistoricoItem(new Date(), 'APROVADA', `${this.solicitacao.clienteNome} (Cliente - resgate)`)
      );
      this.solicitacaoService.atualizar(this.solicitacao);
      this.router.navigate(['/solicitacaoCliente/listar']);
    }
      
  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
