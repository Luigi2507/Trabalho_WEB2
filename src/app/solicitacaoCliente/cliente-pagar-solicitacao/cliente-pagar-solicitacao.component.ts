import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoClienteService } from '../../services/solicitacao-cliente.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPagamentoConfirmadoComponent } from '../modal-pagamento-confirmado/modal-pagamento-confirmado.component';

@Component({
  selector: 'app-cliente-pagar-solicitacao',
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-pagar-solicitacao.component.html',
  styleUrl: './cliente-pagar-solicitacao.component.css',
})

export class ClientePagarSolicitacaoComponent implements OnInit{
  private solicitacaoService = inject(SolicitacaoClienteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private modalService = inject(NgbModal);

  solicitacao = signal<Solicitacao | undefined>(undefined);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    const id = +this.route.snapshot.params['id'];
 
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (s: Solicitacao | null) => this.solicitacao.set(s ?? undefined),
      error: (e: HttpErrorResponse) => {
        alert(e.status === 404 ? 'Solicitação não encontrada.' : 'Não foi possível carregar a solicitação.');
        this.router.navigate(['/solicitacaoCliente/listar']);
      }
    });
  }


  // RF010: o back muda ARRUMADA -> PAGA, registra a data/hora do pagamento e grava no histórico
  confirmarPagamento(): void {
    const s = this.solicitacao();
    if (!s) return;

    this.solicitacaoService.pagar(s.id).subscribe({
      next: () => {
        this.modalService.open(ModalPagamentoConfirmadoComponent, {
          centered: true
        });
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 409 || e.status === 404) {
          alert(e.error?.mensagem ?? 'Esta solicitação não pode mais ser paga.');
          this.router.navigate(['/solicitacaoCliente/listar']);
        } else {
          alert('Não foi possível confirmar o pagamento. Tente novamente.');
        }
      }
    });
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
