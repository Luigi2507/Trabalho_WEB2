import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
    
  
}
