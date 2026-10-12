import { CommonModule, isPlatformBrowser  } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
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
  private platformId = inject(PLATFORM_ID);
  
  solicitacao = signal<Solicitacao | undefined>(undefined);
  
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    const id = +this.route.snapshot.params['id'];
 
    this.solicitacaoService.buscarPorID(id).subscribe({
      next: (s: Solicitacao) => this.solicitacao.set(s),
      error: () => {
        alert('Solicitação não encontrada.');
        this.router.navigate(['/solicitacaoCliente/listar']);
      }
    });
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
    const s = this.solicitacao();
    if (!s) return;
    if (!confirm(`Deseja resgatar a solicitação "${s.descricaoEquipamento}"?`)) return;
 
    s.status = 'APROVADA';
    if (!s.historico) {
      s.historico = [];
    }
 
    s.historico.push(new HistoricoItem(new Date(), 'APROVADA', `${s.clienteNome} (Cliente - resgate)`));
 
    this.solicitacaoService.atualizar(s).subscribe({
      next: () => this.router.navigate(['/solicitacaoCliente/listar'])
    });
  }
      
  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
