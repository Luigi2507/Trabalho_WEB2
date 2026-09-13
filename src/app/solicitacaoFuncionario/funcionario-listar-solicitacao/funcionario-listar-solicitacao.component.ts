import { Component, inject, OnInit } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Router } from '@angular/router';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//tipos de filtros possiveis
type Filtro = 'HOJE' | 'PERIODO' | 'TODAS';

@Component({
  selector: 'app-funcionario-listar-solicitacao',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './funcionario-listar-solicitacao.component.html',
  styleUrl: './funcionario-listar-solicitacao.component.css',
})

export class FuncionarioListarSolicitacaoComponent implements OnInit {
  private solicitacaoService = inject(SolicitacaoService)
  private router = inject(Router)
  todasSolicitacoes: Solicitacao[] = []
  solicitacoes: Solicitacao[] = [] //solici. depois q o filtro é aplicado
  funcionarioLogado: any = null //dados do func logado
  
  visualizacao: 'NOVAS' | 'TODAS' = 'TODAS';
  filtroAtivo: Filtro = 'HOJE' 
  dataInicio: string = ''
  dataFim: string = ''
  
  //verifica se as datas são os mesmo dia
  private mesmaData(d1: Date, d2: Date){
    return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  }

  selecionarVisualizacao(v: 'NOVAS' | 'TODAS'): void {
    this.visualizacao = v;
    this.aplicarFiltro();
  }
  
  aplicarFiltro() : void {
    let lista = [...this.todasSolicitacoes] //cria uma copia da lista
    
    if (this.visualizacao === 'NOVAS') {
      lista = lista.filter(s => s.status === 'ABERTA');
    }

    //solicitaçoes de hoje
    if(this.filtroAtivo === 'HOJE'){
      const hoje = new Date()
      lista = lista.filter(s => this.mesmaData(new Date(s.dataHora), hoje))
      
      //de um periodo especifico
    } else if (this.filtroAtivo === 'PERIODO' && this.dataInicio && this.dataFim) {
      const inicio = new Date(this.dataInicio)
      const fim = new Date(this.dataFim)
      fim.setHours(23, 59, 59, 999) //23h59m59s faz com que o ultimo dia seja incluido tbm
      lista = lista.filter(s => {const data = new Date(s.dataHora);
        return data >= inicio && data <= fim;
      });
    }

    //todas n filtra nada 
    this.solicitacoes = lista.sort((a, b) =>
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  
  }

  //carrega solicitacoes 
  carregar() : void {
    //solic 'redicerionadas' so aparecem para o func q foi definido como destino
    this.todasSolicitacoes = this.solicitacaoService.listarTodos().filter(s => s.status != 'REDIRECIONADA' || s.funcionarioAtual === this.funcionarioLogado.nome)
    this.aplicarFiltro()    
    
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

  //fincalizar uma solicitacao =
  finalizar(solicitacao: Solicitacao): void {
    //pede confirmacao
    if (confirm(`Finalizar a solicitação "${solicitacao.descricaoEquipamento}"?`)) {
      solicitacao.status = 'FINALIZADA';
      solicitacao.funcionarioFinalizacao = this.funcionarioLogado.nome;
      solicitacao.dataFinalizacao = new Date();
      //adicona alterecao no historico
      solicitacao.historico.push({dataHora: new Date(), status: 'FINALIZADA', funcionario: `${this.funcionarioLogado.nome} (Funcionário)`});
      this.solicitacaoService.atualizar(solicitacao);
      this.carregar();
    }
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
    this.funcionarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}');
    this.carregar()  
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
