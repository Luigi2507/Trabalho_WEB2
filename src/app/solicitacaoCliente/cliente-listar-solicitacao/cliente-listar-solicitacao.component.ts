import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { LoginService } from '../../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalResgatarServicoComponent } from '../modal-resgatar-servico/modal-resgatar-servico.component';
import { STATUS } from '../../shared';

const ABAS: Record<string, string[]> = {
  PENDENTES: [STATUS.ABERTA, STATUS.ORCADA],
  EM_ANDAMENTO: [STATUS.APROVADA, STATUS.PAGA, STATUS.ARRUMADA],
  CONCLUIDAS: [STATUS.FINALIZADA, STATUS.REJEITADA]
};

@Component({
  selector: 'app-cliente-listar-solicitacao',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './cliente-listar-solicitacao.component.html',
  styleUrl: './cliente-listar-solicitacao.component.css',
})

export class ClienteListarSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private modalService = inject(NgbModal);
  solicitacoes = signal<Solicitacao[]>([]);
  abaAtiva = signal('TODAS');
  mensagem = signal('');

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.carregarSolicitacoes();
  }

  //busca e mostra somente as solicitaçoes do cliente logado (o back já ordena por data/hora)
  carregarSolicitacoes(): void {
    const clienteId = this.loginService.usuarioLogado()?.id;
    if (!clienteId) {
      this.router.navigate(['/login']);
      return;
    }

    this.solicitacaoService.listarPorCliente(clienteId).subscribe({
      next: (lista: Solicitacao[] | null) => this.solicitacoes.set(lista ?? []),
      error: () => this.mensagem.set('Não foi possível carregar as solicitações. Tente novamente.')
    });
  }

  //filtro de solicitações 
  solicitacoesFiltradas = computed(() => {
    const permitidos = ABAS[this.abaAtiva()];
    return this.solicitacoes().filter(s => !permitidos || permitidos.includes(s.status));
  });

  mudarAba(aba: string): void {
    this.abaAtiva.set(aba);
  }

  descricaoResumida(descricao: string): string {
    if (!descricao) return '';
    return descricao.length > 30 ? descricao.substring(0, 30) + "..." : descricao;
  }

  //define qual acao o cliente pode realizar de acordo com o status da solicitacao
  textoBotaoAcao(status: string): string {

    switch (status) {
      case STATUS.ORCADA: return 'Aprovar/Rejeitar Orçamento';
      case STATUS.REJEITADA: return 'Resgatar Serviço';
      case STATUS.ARRUMADA: return 'Pagar Serviço';
      default: return '';
    }
  }

  //direciona para a tela da acao disponivel
  navegarParaAcao(solicitacao: Solicitacao): void {
    switch (solicitacao.status) {
      case STATUS.ORCADA:
        this.router.navigate(['/solicitacaoCliente/orcamento', solicitacao.id]);
        break;
      case STATUS.ARRUMADA:
        this.router.navigate(['/solicitacaoCliente/pagar', solicitacao.id]);
        break;
      default:
        this.router.navigate(['/solicitacaoCliente/visualizar', solicitacao.id]);
        break;
    }
  }

  //resgatar a solicitacao reprovada
  resgatar($event: any, solicitacao: Solicitacao): void {
    $event.preventDefault();

    const modalRef = this.modalService.open(ModalResgatarServicoComponent, {
      centered: true,
      windowClass: 'modal-resgatar-servico'
    });
    modalRef.componentInstance.descricao = solicitacao.descricaoEquipamento;
    modalRef.result.then(
      () => this.confirmarResgate(solicitacao),
      () => {}
    );
  }

  //o back muda o estado para APROVADA e grava o passo no histórico
  confirmarResgate(solicitacao: Solicitacao): void {
    const clienteId = this.loginService.usuarioLogado()?.id;
    if (!clienteId) {
      this.router.navigate(['/login']);
      return;
    }

    this.solicitacaoService.resgatar(solicitacao.id, clienteId).subscribe({
      next: () => this.carregarSolicitacoes(),
      error: (e: HttpErrorResponse) => {
        if (e.status === 409 || e.status === 404) {
          this.mensagem.set(e.error?.mensagem ?? 'Esta solicitação não pode mais ser resgatada.');
          this.carregarSolicitacoes();
        } else {
          this.mensagem.set('Não foi possível resgatar o serviço. Tente novamente.');
        }
      }
    });
  }
}