import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Router } from '@angular/router';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFinalizarSolicitacaoComponent } from '../modal-finalizar-solicitacao/modal-finalizar-solicitacao.component';

//tipos de filtros possiveis
type Filtro = 'HOJE' | 'PERIODO' | 'TODAS';

@Component({
  selector: 'app-funcionario-listar-solicitacao',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './funcionario-listar-solicitacao.component.html',
  styleUrl: './funcionario-listar-solicitacao.component.css',
})

export class FuncionarioListarSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private modalService = inject(NgbModal);

  todasSolicitacoes: Solicitacao[] = []
  solicitacoes = signal<Solicitacao[]>([]) //solici. depois q o filtro é aplicado
  funcionarioLogado: any = null //dados do func logado
  
  //FILTROS
  visualizacao: 'TODAS' | 'NOVAS' = 'NOVAS';
  filtroAtivo: Filtro = 'TODAS' 
  dataInicio: string = ''
  dataFim: string = ''
  
  //verifica se as datas são os mesmo dia
  private mesmaData(d1: Date, d2: Date){
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  //filtro de solicitações
  selecionarVisualizacao(v: 'NOVAS' | 'TODAS'): void {
    this.visualizacao = v;
    this.carregar();
  }
  
  //filtro de data
  aplicarFiltro() : void {
    let lista = [...this.todasSolicitacoes] //cria uma copia da lista
    
    if (this.visualizacao === 'TODAS') {
      //solicitaçoes de hoje
      if(this.filtroAtivo === 'HOJE'){
        const hoje = new Date()
        lista = lista.filter(s => this.mesmaData(new Date(s.dataHora), hoje));
        
        //de um periodo especifico
      } else if (this.filtroAtivo === 'PERIODO' && this.dataInicio && this.dataFim) {
        const inicio = new Date(this.dataInicio + 'T00:00:00');
        const fim = new Date(this.dataFim + 'T23:59:59.999');
        lista = lista.filter(s => {const data = new Date(s.dataHora);
        return data >= inicio && data <= fim;
        });
      }
    }

    //todas n filtra nada 
    this.solicitacoes.set(lista.sort((a, b) =>
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()));
  }

  //carrega solicitacoes 
  carregar(): void {
    const requisicao = this.visualizacao === 'NOVAS'
      ? this.solicitacaoService.listarAbertas()
      : this.solicitacaoService.listarDoFuncionario(this.funcionarioLogado?.id);

    requisicao.subscribe({
      next: (lista: Solicitacao[]) => {
        this.todasSolicitacoes = lista ?? [];
        this.aplicarFiltro();
      },
      error: (e) => console.error('Erro ao carregar solicitações', e)
    });
  }

  //altera o filtro e atualiza  a lista
  selecionarFiltro(filtro : Filtro): void {
    this.filtroAtivo = filtro
    this.aplicarFiltro()
  }

  descricaoResumida(descricao: string): string {
    if (!descricao) return '';
    return descricao.length > 30 ? descricao.substring(0, 30) + "..." : descricao;
  }

  async finalizar(solicitacao: Solicitacao): Promise<void> {
    const confirmar = await this.abrirModalFinalizarSolicitacao(solicitacao);
    if (!confirmar) return;

    this.solicitacaoService.finalizar(solicitacao.id, this.funcionarioLogado.id).subscribe({
      next: () => this.carregar(),
      error: (e: HttpErrorResponse) => alert(e.error?.mensagem ?? 'Não foi possível finalizar a solicitação. Tente novamente.')
    });
  }

  //Modal para confirmar finalização
  abrirModalFinalizarSolicitacao(solicitacao : Solicitacao) : Promise<boolean>{
    const modalRef = this.modalService.open(ModalFinalizarSolicitacaoComponent);
    modalRef.componentInstance.solicitacao = solicitacao;

    return modalRef.result.then(
      (resultado : boolean) => resultado,
      () => false
    );
  }

  // Cores de cada botão apartir do status
  corStatus(status: string): string {
    switch (status) {
      case 'ABERTA': return 'cinza';
      case 'ORCADA': return 'marrom';
      case 'REJEITADA': return 'vermelho';
      case 'APROVADA': return 'amarelo';
      case 'REDIRECIONADA': return 'roxo';
      case 'ARRUMADA': return 'azul';
      case 'PAGA': return 'alaranjado';
      case 'FINALIZADA': return 'verde';
      default: return '';
    }
  }
  
  //define botao de acordo com o status
  textoBotaoAcao(status: string): string {
    switch (status) {
      case 'ABERTA': return 'Efetuar Orçamento';
      case 'APROVADA':
      case 'REDIRECIONADA': return 'Efetuar Manutenção';
      case 'PAGA': return 'Finalizar Solicitação';
      default: return '';
    }
  }

  //direciona de acordo com o botao
  navegarParaAcao(solicitacao: Solicitacao): void {
    switch (solicitacao.status) {
      case 'ABERTA':
        this.router.navigate(['/solicitacaoFuncionario/orcamento', solicitacao.id]);
        break;
        case 'APROVADA':
        case 'REDIRECIONADA':
            this.router.navigate(['/solicitacaoFuncionario/manutencao', solicitacao.id]);
        break;
        case 'PAGA':
          this.finalizar(solicitacao);
          break;
    }
  }
  
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.funcionarioLogado = this.loginService.usuarioLogado;
    this.carregar()
  }
}