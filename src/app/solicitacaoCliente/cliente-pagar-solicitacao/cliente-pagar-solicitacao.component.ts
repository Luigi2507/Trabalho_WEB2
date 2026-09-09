import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao, HistoricoItem } from '../../shared/models/solicitacao.model';

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

  solicitacao: Solicitacao | undefined;

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.solicitacao = this.solicitacaoService.buscarPorID(id);

    if (this.solicitacao === undefined) {
      throw new Error("Solicitação não encontrada: id = " + id);
    }
  }

//confirma pagamento e altera status
  confirmarPagamento(): void {
    if (!this.solicitacao) return;

    this.solicitacao.status = 'PAGA';
    this.solicitacao.dataPagamento = new Date();
    this.solicitacao.historico.push(
      new HistoricoItem(new Date(), 'PAGA', 'Cliente')
    );
    this.solicitacaoService.atualizar(this.solicitacao);

    alert('Pagamento confirmado!');
    this.router.navigate(['/solicitacaoCliente/listar']);
  }
}
