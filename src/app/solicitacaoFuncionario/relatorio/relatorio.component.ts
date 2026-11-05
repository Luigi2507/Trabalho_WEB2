import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';

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
    if (this.modo === 'periodo' && this.dataInicio && this.dataFim && this.dataInicio > this.dataFim) {
      alert('A data inicial não pode ser maior que a data final.');
      return;
    }

    this.solicitacaoService.listarTodos().subscribe({
      next: (solicitacoes: Solicitacao[]) => this.montarPdf(solicitacoes ?? []),
      error: () => alert('Não foi possível carregar os dados para o relatório.')
    });
  }

  private montarPdf(solicitacoes: Solicitacao[]): void {
    let receitas = solicitacoes.filter(s => s.dataPagamento !== null).map(s => ({
      ...s, dataPagamento: new Date(s.dataPagamento!)
    }));

    if (this.modo === 'periodo') {
      if (this.dataInicio) {
        const inicio = new Date(this.dataInicio + 'T00:00:00');
        receitas = receitas.filter(s => s.dataPagamento >= inicio);
      }
      if (this.dataFim) {
        const fim = new Date(this.dataFim + 'T23:59:59.999');
        receitas = receitas.filter(s => s.dataPagamento <= fim);
      }
    }

    receitas.sort((a, b) => a.dataPagamento.getTime() - b.dataPagamento.getTime());
    const agrupado: { [chave: string]: number } = {};
    receitas.forEach(s => {
      const chave = this.modo === 'periodo'
        ? s.dataPagamento.toLocaleDateString('pt-BR')
        : (s.categoria || 'Sem categoria');
      agrupado[chave] = (agrupado[chave] || 0) + Number(s.orcamento);
    });
    const linhas = Object.entries(agrupado);
    if (this.modo === 'categoria') {
      linhas.sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
    }

    // Criação do PDF
    const pdf = new jsPDF();

    const corMarca: [number, number, number] = [219, 91, 22];
    const corZebra: [number, number, number] = [250, 240, 232];
    const larguraPagina = pdf.internal.pageSize.getWidth();
    const alturaPagina = pdf.internal.pageSize.getHeight();
    const margemEsq = 20;
    const margemDir = larguraPagina - 20;
    const limiteY = alturaPagina - 25;
    const alturaLinha = 9;

    //formata valores em brl
    const formatarMoeda = (valor: number) =>
      valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatarData = (iso: string) => iso.split('-').reverse().join('/');

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

    // periodo escolhido a esquerda e data de geracao a direita
    pdf.setFontSize(9);
    pdf.setTextColor(120, 120, 120);
    if (this.modo === 'periodo') {
      let periodo = 'Todo o período';
      if (this.dataInicio && this.dataFim) {
        periodo = `${formatarData(this.dataInicio)} a ${formatarData(this.dataFim)}`;
      } else if (this.dataInicio) {
        periodo = `A partir de ${formatarData(this.dataInicio)}`;
      } else if (this.dataFim) {
        periodo = `Até ${formatarData(this.dataFim)}`;
      }
      pdf.text(`Período: ${periodo}`, margemEsq, 40);
    }
    pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, margemDir, 40, { align: 'right' });
    pdf.setTextColor(0, 0, 0);


    // tabela
    let y = 52;
    pdf.setFontSize(11);

    if (linhas.length === 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.text('Nenhuma receita encontrada.', margemEsq, y);
    } else {
      //titulos das colunas
      pdf.setFont('helvetica', 'bold');
      pdf.text(this.modo === 'periodo' ? 'Data' : 'Categoria', margemEsq, y);
      pdf.text('Receita', margemDir, y, { align: 'right' });
      y += alturaLinha;

      let zebra = false;
      linhas.forEach(([chave, valor]) => {
        if (y > limiteY) {
          pdf.addPage();
          y = 20;
          zebra = false;
        }
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
      if (y > limiteY - 10) {
        pdf.addPage();
        y = 20;
      }
      const total = linhas.reduce((soma, [, valor]) => soma + valor, 0);

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
    const totalPaginas = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      pdf.setPage(i);
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      pdf.line(margemEsq, alturaPagina - 15, margemDir, alturaPagina - 15);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('WebTech - Sistema de Controle de Manutenção de Equipamentos', margemEsq, alturaPagina - 10);
      pdf.text(`Página ${i} de ${totalPaginas}`, margemDir, alturaPagina - 10, { align: 'right' });
    }

    // salvar
    const nomeArquivo =
      this.modo === 'periodo'
        ? 'relatorio-receitas-periodo.pdf'
        : 'relatorio-receitas-categoria.pdf';

    pdf.save(nomeArquivo);
  }
}
