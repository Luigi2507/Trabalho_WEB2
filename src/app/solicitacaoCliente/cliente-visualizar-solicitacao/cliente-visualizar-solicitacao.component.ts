import { CommonModule, isPlatformBrowser  } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoClienteService } from '../../services/solicitacao-cliente.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalResgatarServicoComponent } from '../modal-resgatar-servico/modal-resgatar-servico.component';

@Component({
  selector: 'app-cliente-visualizar-solicitacao',
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-visualizar-solicitacao.component.html',
  styleUrl: './cliente-visualizar-solicitacao.component.css',
})

export class ClienteVisualizarSolicitacaoComponent implements OnInit{
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

    const modalRef = this.modalService.open(ModalResgatarServicoComponent, {
      centered: true,
      windowClass: 'modal-resgatar-servico'
    });
    modalRef.componentInstance.descricao = s.descricaoEquipamento;
    modalRef.result.then (
      () => this.confirmarResgate(),
      () => {}
    );
  }

   //o back muda para APROVADA e grava no histórico; depois volta para a lista
  confirmarResgate(): void {
    const s = this.solicitacao();
    if (!s) return;

    this.solicitacaoService.resgatar(s.id).subscribe({
      next: () => this.router.navigate(['/solicitacaoCliente/listar']),
      error: (e: HttpErrorResponse) => {
        if (e.status === 409 || e.status === 404) {
          alert(e.error?.mensagem ?? 'Esta solicitação não pode mais ser resgatada.');
          this.router.navigate(['/solicitacaoCliente/listar']);
        } else {
          alert('Não foi possível resgatar o serviço. Tente novamente.');
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
