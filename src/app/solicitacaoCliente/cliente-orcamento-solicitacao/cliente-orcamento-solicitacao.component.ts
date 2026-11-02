import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoClienteService } from '../../services/solicitacao-cliente.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalServicoRejeitadoComponent } from '../modal-servico-rejeitado/modal-servico-rejeitado.component';

@Component({
  selector: 'app-cliente-orcamento-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-orcamento-solicitacao.component.html',
  styleUrl: './cliente-orcamento-solicitacao.component.css',
})

export class ClienteOrcamentoSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoClienteService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  solicitacao = signal<Solicitacao | undefined>(undefined);
  mostrarRejeicao: boolean = false;
  motivoRejeicao: string = '';

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

  // RF006: o back muda ORCADA -> APROVADA e grava no histórico
  aprovar(): void {
    const s = this.solicitacao();
    if (!s) return;

    this.solicitacaoService.aprovar(s.id).subscribe({
      next: (atualizada: Solicitacao | null) => {
        const valor = (atualizada?.orcamento ?? s.orcamento)
          .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        alert(`Serviço Aprovado no Valor R$ ${valor}`);
        this.router.navigate(['/solicitacaoCliente/listar']);
      },
      error: (e: HttpErrorResponse) => this.tratarErro(e, 'aprovar o serviço')
    });
  }

  // exibe o campo de motivo da rejeicao
  abrirRejeicao(): void {
    this.mostrarRejeicao = true;
  }

  // RF007: o back muda ORCADA -> REJEITADA, guarda o motivo e grava no histórico
  confirmarRejeicao(): void {
    const s = this.solicitacao();
    if (!s || !this.motivoRejeicao.trim()) return;

    this.solicitacaoService.rejeitar(s.id, this.motivoRejeicao.trim()).subscribe({
      next: () => {
        const modalRef = this.modalService.open(ModalServicoRejeitadoComponent, {
          centered: true,
          windowClass: 'modal-servico-rejeitado'
        });
        const voltar = () => this.router.navigate(['/solicitacaoCliente/listar']);
        modalRef.result.then(voltar, voltar);
      },
      error: (e: HttpErrorResponse) => this.tratarErro(e, 'rejeitar o serviço')
    });
  }

  // 404/409: a solicitação mudou de estado (ou não existe mais); volta para a lista
  private tratarErro(e: HttpErrorResponse, acao: string): void {
    if (e.status === 409 || e.status === 404) {
      alert(e.error?.mensagem ?? 'Esta solicitação não pode mais ser alterada.');
      this.router.navigate(['/solicitacaoCliente/listar']);
    } else {
      alert(`Não foi possível ${acao}. Tente novamente.`);
    }
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
