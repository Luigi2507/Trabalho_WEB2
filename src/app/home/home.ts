import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Servico {
  icone: string;
  titulo: string;
  descricao: string;
}

interface Produto {
  imagem: string;
  nome: string;
  categoria: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  //BOTÃO ORÇAMENTO
  public acaoEmAndamento: boolean = false;
  public btnHomeTexto: string = 'Solicitar Orçamento';

  //MÉTODOS DO BOTÃO ORÇAMENTO
  public btnHomeAnimacao(): void{
    this.acaoEmAndamento = true;
    this.btnHomeTexto = 'Carregando';

    setTimeout(()=> {
      this.acaoEmAndamento = false;
      this.btnHomeTexto = 'Solicitar Orçamento';
    },2000);
  }
  
  public resetBtnHome(): void{
    this.acaoEmAndamento = false;
    this.btnHomeTexto = 'Solicitar Orçamento'; 
  }
    
  public servicos: Servico[] = [
    {
      icone: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
      titulo: 'Avaliação Inicial',
      descricao: 'Avaliação tecnica completa para identificar a causa do problema',
    },
    {
      icone: 'M14.305 19.53l.923-.382 M15.228 16.852l-.923-.383 M16.852 15.228l-.383-.923 M16.852 20.772l-.383.924 M17 2v4.172a2 2 0 0 1-.586 1.414l-8.828 8.828A2 2 0 0 0 7 17.828V22 M19.148 15.228l.383-.923 M19.53 21.696l-.382-.924 M20.772 16.852l.924-.383 M20.772 16.852l.924.383 M5 22h6.159 M5 2h14 M7 2v4.172a2 2 0 0 0 .586 1.414l5.188 5.188 M15,18a3,3 0 1,0 6,0a3,3 0 1,0 -6,0',
      titulo: 'Manutenção Preventiva',
      descricao: 'Cuidados periódicos que evitam falhas antes que elas aconteçam',
    },
    {
      icone: 'M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z',
      titulo: 'Manutenção Corretiva',
      descricao: 'Conserto rápido e eficiente para equipamentos com defeito',
    },
    {
      icone: 'M5,8a5,5 0 1,0 10,0a5,5 0 1,0 -10,0 M2 21a8 8 0 0 1 10.434-7.62 M15,18a3,3 0 1,0 6,0a3,3 0 1,0 -6,0 M22 22l-1.9-1.9',
      titulo: 'Acompanhamento Online',
      descricao: 'Acompanhe o orçamento e o status do reparo em tempo real',
    },
  ];
}
