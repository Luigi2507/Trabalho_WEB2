import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { LoginService } from '../../services/login.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-funcionario-orcamento-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './funcionario-orcamento-solicitacao.component.html',
  styleUrl: './funcionario-orcamento-solicitacao.component.css',
})
export class FuncionarioOrcamentoSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private loginService = inject(LoginService)
  private platformId = inject(PLATFORM_ID)

  solicitacao = signal<Solicitacao | undefined>(undefined)
  funcionarioLogado: any = null;
  valorOrcamento: string = '';
  
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    this.funcionarioLogado = this.loginService.usuarioLogado;
    const id = +this.route.snapshot.params['id']
 
    this.solicitacaoService.buscarPorIDFuncionario(id).subscribe({
      next: (s: Solicitacao) => this.solicitacao.set(s),
      error: () => {
        alert('Solicitação não encontrada.');
        this.router.navigate(['/solicitacaoFuncionario/listar']);
      }
    });
  }

  get valorOrcamentoNumerico(): number {
    const valor = this.valorOrcamento.replace(/\./g, '').replace(',', '.');

    return Number(valor);
  }

    salvarOrcamento(): void {
    const s = this.solicitacao();
    const valor = this.valorOrcamentoNumerico;

    if (!s || !Number.isFinite(valor) || valor <= 0) return;

    this.solicitacaoService.orcar(s.id, this.funcionarioLogado.id, valor).subscribe({
      next: () => this.router.navigate(['/solicitacaoFuncionario/listar']),
      error: (e: HttpErrorResponse) => alert(e.error?.mensagem ?? 'Não foi possível salvar o orçamento. Tente novamente.')
    });
  }
}