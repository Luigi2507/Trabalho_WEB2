import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';

//Biblioteca para gerar o PDF
import jsPDF from 'jspdf';

@Component({
  selector: 'app-relatorio',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css',
})

export class RelatorioComponent {
  private solicitacaoService = inject(SolicitacaoService);

  modo: 'periodo' | 'categoria' = 'periodo';

  dataInicio: string = '';
  dataFim: string = '';

  gerarPdf(): void {
  const solicitacoes = this.solicitacaoService.listarTodos();
  let receitas = solicitacoes.filter(s => s.dataPagamento !== null);
  const pdf = new jsPDF();

    if (this.dataInicio) {
      const inicio = new Date(this.dataInicio);
      inicio.setHours(0, 0, 0, 0);

      receitas = receitas.filter(s => s.dataPagamento !== null 
                            && s.dataPagamento >= inicio);
    }

    if (this.dataFim) {
      const fim = new Date(this.dataFim);
      fim.setHours(23, 59, 59, 999);

      receitas = receitas.filter(s => s.dataPagamento !== null
                            && s.dataPagamento <= fim);
    }

    //PDF
    const larguraPagina = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('WEBTECH', larguraPagina / 2, 20);  //(texto, posição no eixo X, posição no eixo Y)

    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Relatório de Receitas por Período', larguraPagina / 2, 30);

    pdf.line(20, 35, larguraPagina - 20, 35);
    pdf.setFontSize(12);
    let y = 50;

    if (receitas.length === 0) {
      pdf.text('Nenhuma receita encontrada no período.', 20, y);
    } else {
      receitas.forEach(solicitacao => {
        const data = solicitacao.dataPagamento!;

        const dataFormatada = data.toLocaleDateString('pt-BR');
        const valorFormatado =
          solicitacao.orcamento.toLocaleString('pt-BR',
                                            {style: 'currency', currency: 'BRL'});

        pdf.text(`${dataFormatada} - ${valorFormatado}`, 20, y);

        y += 7;
      });
    }

    pdf.save('relatorio-receitas-periodo.pdf');
  }
}
