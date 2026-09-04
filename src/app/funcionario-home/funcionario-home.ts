import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

interface Solicitacao {
  id:number;
  dataAbertura: Date;
  nomeCliente: string;
  descricaoProduto: string;
}

@Component({
  selector: 'app-funcionario-home',
  imports: [CommonModule],
  templateUrl: './funcionario-home.html',
  styleUrl: './funcionario-home.css',
})
export class FuncionarioHome {

  public solicitacoesAbertas: Solicitacao[] = [];

  public efetuarOrcamento(idSolicitacao:number): void {
  }
}
