import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao, HistoricoItem } from '../../shared/models/solicitacao.model';

@Component({
  selector: 'app-cliente-orcamento-solicitacao',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './cliente-orcamento-solicitacao.component.html',
  styleUrl: './cliente-orcamento-solicitacao.component.css',
})

export class ClienteOrcamentoSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  solicitacao = signal<Solicitacao | undefined>(undefined);
  mostrarRejeicao: boolean = false;
  motivoRejeicao: string = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    const id = +this.route.snapshot.params['id'];
 
    this.solicitacaoService.buscarPorID(id).subscribe({next: (s: Solicitacao) => this.solicitacao.set(s),error: () => {
      alert('Solicitação não encontrada.');
      this.router.navigate(['/solicitacaoCliente/listar']);}
    });
  }

// aprova o orcamento e muda o status
  aprovar(): void {
    const s = this.solicitacao();
    if (!s) return;
 
    s.status = 'APROVADA'; 
    if (!s.historico) {
      s.historico = [];
    }
 
    s.historico.push(new HistoricoItem(new Date(), 'APROVADA', `${s.clienteNome} (Cliente)`));
 
    this.solicitacaoService.atualizar(s).subscribe({next: () => {
        alert(`Serviço Aprovado no Valor R$ ${s.orcamento.toFixed(2)}`);
        this.router.navigate(['/solicitacaoCliente/listar']);}
    });
  }

// exibe o campo de motivo da rejeicao
  abrirRejeicao(): void {
    this.mostrarRejeicao = true;
  }

  confirmarRejeicao(): void {
    const s = this.solicitacao();
    if (!s || !this.motivoRejeicao.trim()) return;
 
    s.status = 'REJEITADA';
    s.motivoRejeicao = this.motivoRejeicao;
    if (!s.historico) {
      s.historico = [];
    }
    s.historico.push(new HistoricoItem(new Date(), 'REJEITADA', `${s.clienteNome} (Cliente)`));
 
    this.solicitacaoService.atualizar(s).subscribe({next: () => {
      alert('Serviço Rejeitado');
      this.router.navigate(['/solicitacaoCliente/listar']);}
    });
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
