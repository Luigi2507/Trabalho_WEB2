import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { Funcionario } from '../../shared/models/funcionario.model';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-funcionario-manutencao-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './funcionario-manutencao-solicitacao.component.html',
  styleUrl: './funcionario-manutencao-solicitacao.component.css',
})

export class FuncionarioManutencaoSolicitacaoComponent implements OnInit{
  private solicitacaoService = inject(SolicitacaoService)
  private funcionarioService = inject(FuncionarioService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loginService = inject(LoginService)
  private platformId = inject(PLATFORM_ID);

  solicitacao = signal<Solicitacao | undefined>(undefined)
  funcionarioLogado: any = null

  modo: 'manutencao' | 'redirecionar' = 'manutencao';

  descricaoManutencao: string = '';
  orientacoesCliente: string = '';
  funcionariosDisponiveis = signal<Funcionario[]>([]);
  funcionarioDestinoId: number = 0;
  
  efetuarManutencao(): void {
    const s = this.solicitacao();
    if (!s) return;
    if (!this.descricaoManutencao.trim() || !this.orientacoesCliente.trim()) return;
 
    this.solicitacaoService.efetuarManutencao(
      s.id, this.funcionarioLogado.id, this.descricaoManutencao, this.orientacoesCliente).subscribe({
      next: () => this.router.navigate(['/solicitacaoFuncionario/listar']),
      error: (e: HttpErrorResponse) => alert(e.error?.mensagem ?? 'Não foi possível registrar a manutenção. Tente novamente.')
    });
  }

  redirecionar(): void {
    const s = this.solicitacao();
    if (!s || !this.funcionarioDestinoId) return;
 
    this.solicitacaoService.redirecionar(s.id, this.funcionarioLogado.id, this.funcionarioDestinoId).subscribe({
      next: () => this.router.navigate(['/solicitacaoFuncionario/listar']),
      error: (e: HttpErrorResponse) => alert(e.error?.mensagem ?? 'Não foi possível redirecionar. Tente novamente.')
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    this.funcionarioLogado = this.loginService.usuarioLogado;
    const id = +this.route.snapshot.params['id'];
 
    this.solicitacaoService.buscarPorIDFuncionario(id).subscribe({
      next: (s: Solicitacao) => this.solicitacao.set(s),
      error: () => {this.router.navigate(['/solicitacaoFuncionario/listar']);}
    });
  
    //funcionarios que podem receber o redirecionamento (menos o próprio)
    this.funcionarioService.listarTodos().subscribe({next: (lista: Funcionario[]) => {
      this.funcionariosDisponiveis.set((lista ?? []).filter((f: Funcionario) => f.id !== this.funcionarioLogado?.id));}
    });
  }
}