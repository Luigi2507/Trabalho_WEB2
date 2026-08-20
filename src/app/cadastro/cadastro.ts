import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  imports: [],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro {
  public carregandoDados: boolean = false;
  public bloqueado: boolean = false;
  public btnCadastroTexto: string = 'Cadastrar-se';

  public btnCadastroAnimacao(): void{
    this.carregandoDados = true;
    this.bloqueado = true;
    this.btnCadastroTexto = 'Cadastro em andamento...';

    setTimeout(() =>{
      this.carregandoDados = false;
      this.bloqueado = false;
      this.btnCadastroTexto = 'Cadastrar-se';
    },2000);
  }

  public resetBtnCadastro(): void{
    this.carregandoDados = false;
    this.bloqueado = false;
    this.btnCadastroTexto = 'Cadastrar-se';
  }
}
