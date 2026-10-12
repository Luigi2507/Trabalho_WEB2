import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { HistoricoItem, Solicitacao } from '../../shared/models/solicitacao.model';
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
 
    s.status = 'ARRUMADA';
    s.descricaoManutencao = this.descricaoManutencao;
    s.orientacoesCliente = this.orientacoesCliente;
    s.funcionarioManutencao = this.funcionarioLogado.nome;
    s.funcionarioAtual = this.funcionarioLogado.nome;
    
    if (!s.historico) {
      s.historico = [];
    }
    s.historico.push(new HistoricoItem(new Date(), 'ARRUMADA', `${this.funcionarioLogado.nome} (Funcionário)`));
 
    this.solicitacaoService.atualizar(s).subscribe({
      next: () => this.router.navigate(['/solicitacaoFuncionario/listar'])
    });
  }

  redirecionar(): void {
    const s = this.solicitacao();
    if (!s || !this.funcionarioDestinoId) return;
 
    const destino = this.funcionariosDisponiveis().find(f => f.id === this.funcionarioDestinoId);
    if (!destino) return;
 
    s.status = 'REDIRECIONADA';
    s.funcionarioAtual = destino.nome;
 
    if (!s.historico) {
      s.historico = [];
    }
    
    //registra origem e destino no historico (RF015)
    s.historico.push(new HistoricoItem(new Date(), 'REDIRECIONADA',`${this.funcionarioLogado.nome} (Funcionário) → ${destino.nome}`));
 
    this.solicitacaoService.atualizar(s).subscribe({
      next: () => this.router.navigate(['/solicitacaoFuncionario/listar'])
    });
  
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
 
    this.funcionarioLogado = this.loginService.usuarioLogado;
    const id = +this.route.snapshot.params['id'];
 
    this.solicitacaoService.buscarPorID(id).subscribe({next: (s: Solicitacao) => this.solicitacao.set(s),
    error: () => {this.router.navigate(['/solicitacaoFuncionario/listar']);}
    });
  
    //funcionarios que podem receber o redirecionamento 
    this.funcionarioService.listarTodos().subscribe({next: (lista: Funcionario[]) => {
      this.funcionariosDisponiveis.set((lista ?? []).filter((f: Funcionario) => f.nome !== this.funcionarioLogado?.nome));}
    });
  }
}
