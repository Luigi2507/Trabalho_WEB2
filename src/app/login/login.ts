import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private router: Router) {}

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
    if (this.senha.length < 4 || this.senha.length > 4){
      this.erroSenha = 'Inclua ao menos 4 caracteres.';
      return false;
    }
    this.erroSenha = '';
    return true;
  }

  public btnLoginAnimacao(): void{
    //validar os campos
    const emailValido = this.validarEmail();
    const senhaValida = this.validarSenha();

    if (!emailValido || !senhaValida) {
      this.mensagemStatus = 'Por favor, preencha os campos corretamente.';
      return;
    }

    this.btnCarregando = true;
    this.btnDesativado = true;
    this.btnLoginTexto = 'Aguarde...';
    
    setTimeout(() => {
      //buscar os dados
      const clientes = JSON.parse( localStorage.getItem('clientes') || '[]');
      
      // Procura primeiro nos clientes
      const cliente = clientes.find(
        (obj: any) => obj.email.toLowerCase() === this.email.toLowerCase() && obj.senha === this.senha);
        
      // Se encontrou cliente
      if (cliente) {
        localStorage.setItem( 'usuarioLogado', JSON.stringify(cliente));

        this.btnCarregando = false;
        this.btnDesativado = false;
        this.btnLoginTexto = 'Entrar';

        this.router.navigate(['/solicitacaoCliente']);
        return
      }

      //Procura o funcionario
      const funcionarios = JSON.parse( localStorage.getItem('funcionarios') || '[]');

      const funcionario = funcionarios.find((obj: any) => obj.email === this.email && obj.senha === this.senha);
            
      // Se encontrou funcionário
      if (funcionario) {

        localStorage.setItem('usuarioLogado', JSON.stringify(funcionario));
        
        this.btnCarregando = false;
        this.btnDesativado = false;
        this.btnLoginTexto = 'Entrar';

        this.router.navigate(['/funcionario-home']);

        return;
      }

      // Se não encontrou ninguém
      this.btnCarregando = false;
      this.btnDesativado = false;
      this.btnLoginTexto = 'Entrar';

      this.mensagemStatus = 'E-mail ou senha incorretos.';

    }, 500);
  }
  
  public resetBtnEstado (): void{
    this.btnCarregando = false;
    this.btnDesativado = false;
    this.btnLoginTexto = 'Entrar';
  }


  public limparErros(): void{
    this.erroEmail = '';
    this.erroSenha = '';
    this.mensagemStatus = '';
  }
}
