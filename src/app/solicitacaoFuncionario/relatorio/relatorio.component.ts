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

    const corMarca: [number, number, number] = [219, 91, 22];
    const corZebra: [number, number, number] = [250, 240, 232];
    const larguraPagina = pdf.internal.pageSize.getWidth();
    const alturaPagina = pdf.internal.pageSize.getHeight();

    //formata valores em brl
    const formatarMoeda = (valor: number) =>
      valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // cabecalho
    pdf.setFillColor(...corMarca);
    pdf.rect(0, 0, larguraPagina, 32, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('WEBTECH', larguraPagina / 2, 15, { align: 'center' });

    const tituloRelatorio =
      this.modo === 'periodo'
        ? 'Relatório de Receitas por Período'
        : 'Relatório de Receitas por Categoria';

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(tituloRelatorio, larguraPagina / 2, 24, { align: 'center' });

    pdf.setTextColor(0, 0, 0);

    //data de geracao alinhada a direita
    const agora = new Date().toLocaleDateString('pt-BR');
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Gerado em ${agora}`, larguraPagina - 20, 40, { align: 'right' });
    pdf.setTextColor(0, 0, 0);

    if (this.modo === 'periodo') {
      if (this.dataInicio) {
        const inicio = new Date(this.dataInicio);
        inicio.setHours(0, 0, 0, 0);
        receitas = receitas.filter(s => s.dataPagamento !== null && s.dataPagamento >= inicio);
      }
      if (this.dataFim) {
        const fim = new Date(this.dataFim);
        fim.setHours(23, 59, 59, 999);
        receitas = receitas.filter(s => s.dataPagamento !== null && s.dataPagamento <= fim);
      }
    }

    // agrupamento
    const agrupado: { [chave: string]: number } = {};

    receitas.forEach(solicitacao => {
      const chave = 
      this.modo === 'periodo'
        ? solicitacao.dataPagamento!.toLocaleDateString('pt-BR')
        : (solicitacao.categoria || 'Sem categoria');

      agrupado[chave] = (agrupado[chave] || 0) + solicitacao.orcamento;
    });

    // tabela
    let y = 50;
    const alturaLinha = 9;
    const margemEsq = 20;
    const margemDir = larguraPagina - 20;

    pdf.setFontSize(11);

    if (receitas.length === 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.text('Nenhuma receita encontrada.', margemEsq, y);
    } else {
      let zebra = false;

      Object.entries(agrupado).forEach(([chave, valor]) => {
        if (zebra) {
          pdf.setFillColor(...corZebra);
          pdf.rect(margemEsq - 2, y - 6, margemDir - margemEsq + 4, alturaLinha, 'F');
        }
        zebra = !zebra;

        pdf.setFont('helvetica', 'normal');
        pdf.text(chave, margemEsq, y);
        pdf.text(formatarMoeda(valor), margemDir, y, { align: 'right' });

        y += alturaLinha;

      });

      // linha total
      const total = Object.values(agrupado).reduce((soma, valor) => soma + valor, 0);

      pdf.setDrawColor(...corMarca);
      pdf.setLineWidth(0.6);
      pdf.line(margemEsq, y, margemDir, y);

      y += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...corMarca);
      pdf.text('TOTAL', margemEsq, y);
      pdf.text(formatarMoeda(total), margemDir, y, { align: 'right' });
      pdf.setTextColor(0, 0, 0);
    }

    // rodapé
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(margemEsq, alturaPagina - 15, margemDir, alturaPagina - 15);

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('WebTech - Sistema de Controle de Manutenção de Equipamentos', margemEsq, alturaPagina - 10);
    pdf.text('Página 1', margemDir, alturaPagina - 10, { align: 'right' });

    // salvar
    const nomeArquivo =
      this.modo === 'periodo'
        ? 'relatorio-receitas-periodo.pdf'
        : 'relatorio-receitas-categoria.pdf';

    pdf.save(nomeArquivo);
  }
}
