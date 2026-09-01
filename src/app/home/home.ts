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
      icone: 'M12 2v20M2 12h20',
      titulo: 'Diagnóstico',
      descricao: 'Avaliação...',
    },
    {
      icone: 'M4 4h16v16H4z',
      titulo: 'Manutenção ...',
      descricao: 'Cuidados...',
    },
    {
      icone: 'M12 2l9 4v6c0 5-3.8 9.4-9 10-5.2-.6-9-5-9-10V6l9-4z',
      titulo: 'Manutenção ...',
      descricao: 'Conserto rápido...',
    },
    {
      icone: 'M12 20l9-16H3l9 16z',
      titulo: 'Acompanhamento Online',
      descricao: 'Acompanhe o orçamento...',
    },
  ];

  //SEÇÃO PRODUTOS/EQUIPAMENTOS EM DESTAQUE
  public produtos: Produto[] = [
    { imagem: 'images/notebook-3.png', nome: 'Notebooks', categoria: 'Informática' },
    { imagem: 'images/impressora.png', nome: 'Impressoras', categoria: 'Escritório' },
    { imagem: 'images/microfone-2.png', nome: 'Microfones', categoria: 'Equipamentos' },
    { imagem: 'images/celular.png', nome: 'Celulares', categoria: 'Mobile' },
  ];
}
