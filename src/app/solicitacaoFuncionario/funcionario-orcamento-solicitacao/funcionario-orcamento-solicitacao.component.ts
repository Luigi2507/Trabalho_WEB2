import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { HistoricoItem, Solicitacao } from '../../shared/models/solicitacao.model';

@Component({
  selector: 'app-funcionario-orcamento-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './funcionario-orcamento-solicitacao.component.html',
  styleUrl: './funcionario-orcamento-solicitacao.component.css',
})
export class FuncionarioOrcamentoSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  solicitacao: Solicitacao | undefined
  funcionarioLogado: any = null
  valorOrcamento: number = 0
  
  ngOnInit(): void {
    this.funcionarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const id = +this.route.snapshot.params['id']
    this.solicitacao = this.solicitacaoService.buscarPorID(id)

    if(this.solicitacao === undefined){
       throw new Error("Solicitação não encontrada: id = " + id);
    }
  }

  salvarOrcamento() : void {
    if(!this.solicitacao || this.valorOrcamento < 0) return;

    this.solicitacao.orcamento = this.valorOrcamento;
    this.solicitacao.funcionarioOrcamento = this.funcionarioLogado.nome;
    this.solicitacao.status = 'ORCADA';
    this.solicitacao.historico.push(
      new HistoricoItem(new Date(), 'ORCADA', this.funcionarioLogado.nome)
    );
    this.solicitacaoService.atualizar(this.solicitacao);

    this.router.navigate(['/solicitacaoFuncionario/listar']);
  }
}
