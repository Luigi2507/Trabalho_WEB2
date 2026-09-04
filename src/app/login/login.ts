import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  public btnCarregando: boolean = false;
  public btnLoginTexto: string = 'Entrar';
  public btnDesativado: boolean = false;

  public email: string = '';
  public senha: string = '';
  public erroEmail: string = '';
  public erroSenha: string = '';
  public mensagemStatus: string = '';

  public bolinhas = Array.from({ length: 50 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    tamanho: Math.random() * 20 + 8,
    delay: Math.random() * 5,
    duracao: Math.random() * 4 + 4,
    cor: ['#db5b16', '#f5822b', '#ffb17a', '#c22e08'][Math.floor(Math.random() * 4)]
  }));

  public btnLoginAnimacao(): void{
    const emailValido = this.validarEmail();
    const senhaValida = this.validarSenha();

    this.btnCarregando = true;
    this.btnDesativado = true;
    this.btnLoginTexto = 'Aguarde...';

    setTimeout(() => {
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnLoginTexto = 'Entrar';
    },2000);

    if (!emailValido || !senhaValida){
      this.mensagemStatus = 'Por favor, preencha os campos corretamente.';
      return;
    }
  }
  
  public resetBtnEstado (): void{
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnLoginTexto = 'Entrar';
  }

  public validarEmail(): boolean{
    if (!this.email){
      this.erroEmail = 'E-mail obrigatório.';
      return false;
    }
    if (!this.email.includes('@') || !this.email.includes('.')){
      this.erroEmail = 'Forneça um e-mail válido.';
      return false;
    }
    this.erroEmail = '';
    return true;
  }

  public validarSenha(): boolean{
    if (!this.senha){
      this.erroSenha = 'Senha obrigatória.';
      return false;
    }
    if (this.senha.length< 6){
      this.erroSenha = 'Inclua ao menos 6 caracteres.';
      return false;
    }
    this.erroSenha = '';
    return true;
  }

  public limparErros(): void{
    this.erroEmail = '';
    this.erroSenha = '';
    this.mensagemStatus = '';
  }
}
