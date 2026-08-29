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

  public bolinhas = Array.from({ length: 50 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    tamanho: Math.random() * 20 + 8,
    delay: Math.random() * 5,
    duracao: Math.random() * 4 + 4,
    cor: ['#db5b16', '#f5822b', '#ffb17a', '#c22e08'][Math.floor(Math.random() * 4)]
  }));

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
