import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatorio',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css',
})

export class RelatorioComponent {
  modo: 'periodo' | 'categoria' = 'periodo';

  dataInicio: string = '';
  dataFim: string = '';

  gerarPdf(): void {
    alert('não funciona');
  }
}
