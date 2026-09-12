import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

  solicitacao: Solicitacao | undefined;
  mostrarRejeicao: boolean = false;
  motivoRejeicao: string = '';

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.solicitacao = this.solicitacaoService.buscarPorID(id);

    if (this.solicitacao === undefined) {
      throw new Error("Solicitação não encontrada: id = " + id);
    }
  }

// aprova o orcamento e muda o status
  aprovar(): void {
    if (!this.solicitacao) return;

    this.solicitacao.status = 'APROVADA';
    this.solicitacao.historico.push(new HistoricoItem(new Date(), 'APROVADA', 'Cliente'));
    this.solicitacaoService.atualizar(this.solicitacao);

    alert(`Serviço Aprovado no Valor R$ ${this.solicitacao.orcamento.toFixed(2)}`);
    this.router.navigate(['/solicitacaoCliente/listar']);
  }

// exibe o campo de motivo da rejeicao
  abrirRejeicao(): void {
    this.mostrarRejeicao = true;
  }

  confirmarRejeicao(): void {
    if (!this.solicitacao || !this.motivoRejeicao.trim()) return;

    this.solicitacao.status = 'REJEITADA';
    this.solicitacao.motivoRejeicao = this.motivoRejeicao;
    this.solicitacao.historico.push(
      new HistoricoItem(new Date(), 'REJEITADA', 'Cliente')
    );
    this.solicitacaoService.atualizar(this.solicitacao);

    alert('Serviço Rejeitado');
    this.router.navigate(['/solicitacaoCliente/listar']);
  }

  sair($event: any): void {
    $event.preventDefault();
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
