import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  public btnCarregando: boolean = false;
  public btnTexto: string = 'Entrar';
  public btnDesativado: boolean = false;

  public btnLoginAnimacao(): void{
    this.btnCarregando = true;
    this.btnDesativado = true;
    this.btnTexto = 'Aguarde...';

    setTimeout(() => {
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnTexto = 'Entrar';
    },2000);
  }
  
  public resetBtnEstado (): void{
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnTexto = 'Entrar';
  }
}
