import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  public btnCarregando: boolean = false;
  public btnLoginTexto: string = 'Entrar';
  public btnDesativado: boolean = false;

  public btnLoginAnimacao(): void{
    this.btnCarregando = true;
    this.btnDesativado = true;
    this.btnLoginTexto = 'Aguarde...';

    setTimeout(() => {
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnLoginTexto = 'Entrar';
    },2000);
  }
  
  public resetBtnEstado (): void{
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnLoginTexto = 'Entrar';
  }
}
