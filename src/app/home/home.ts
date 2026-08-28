import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
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
}
