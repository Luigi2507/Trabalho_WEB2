import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao, HistoricoItem } from '../../shared/models/solicitacao.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPagamentoConfirmadoComponent } from '../modal-pagamento-confirmado/modal-pagamento-confirmado.component';

@Component({
  selector: 'app-cliente-pagar-solicitacao',
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-pagar-solicitacao.component.html',
  styleUrl: './cliente-pagar-solicitacao.component.css',
})

export class ClientePagarSolicitacaoComponent implements OnInit{
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private modalService = inject(NgbModal);

  solicitacao = signal<Solicitacao | undefined>(undefined);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    const id = +this.route.snapshot.params['id'];
 
    this.solicitacaoService.buscarPorID(id).subscribe({next: (s: Solicitacao) => this.solicitacao.set(s), error: () => {
      alert('Solicitação não encontrada.');
      this.router.navigate(['/solicitacaoCliente/listar']);}
    });
  }

//confirma pagamento e altera status
  confirmarPagamento(): void {
    const s = this.solicitacao();
    if (!s) return;
 
    s.status = 'PAGA';
    s.dataPagamento = new Date();
 
    if (!s.historico) {
      s.historico = [];
    }
    s.historico.push(new HistoricoItem(new Date(), 'PAGA', `${s.clienteNome} (Cliente)`));
    
    this.solicitacaoService.atualizar(s).subscribe({next: () => {
      const modalRef = this.modalService.open(ModalPagamentoConfirmadoComponent, {
          centered: true
      });
    }
    });
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
