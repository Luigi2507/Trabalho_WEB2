import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  //ANIMAÇÃO DOS BOTOES
  public btnCarregando: boolean = false;
  public btnLoginTexto: string = 'Entrar';
  public btnDesativado: boolean = false;

  //DADOS PARA ENTRAR
  public email: string = '';
  public senha: string = '';

  //MENSAGENS DE ERRO
  public erroEmail: string = '';
  public erroSenha: string = '';
  public mensagemStatus: string = '';

  //ANIMAÇÃO DE FUNDO
  public bolinhas = Array.from({ length: 50 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    tamanho: Math.random() * 20 + 8,
    delay: Math.random() * 5,
    duracao: Math.random() * 4 + 4,
    cor: ['#db5b16', '#f5822b', '#ffb17a', '#c22e08'][Math.floor(Math.random() * 4)]
  }));

  //MODAL DE RECUPERAR SENHA
  public exibirModalEsqueciSenha: boolean = false
  public emailRecuperacao: string = ''
  public erroModalRecuperacao: string = ''
  public novaSenhaGerada: string = ''

  // BUSCA PELO LOCALSTOREGE COM OS DADOS ATUALIZADOS
  private get clientes(): any[] {
    return JSON.parse(localStorage.getItem('clientes') || '[]')
  }

  private get funcionarios(): any[] {
    return JSON.parse(localStorage.getItem('funcionarios') || '[]')
  }

  //VALIDÇÃO DO CAMPO EMAIL
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

  //VALIDAÇÃO DO CAMPO SENHA
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

  //VALIDAÇÃO E ANIMAÇÃO DO CAMPOS
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
      const emailDigitado = this.email.toLowerCase()

      // Procura primeiro o cliente no LocalStorange
      const cliente = this.clientes.find((obj: any) => obj.email?.toLowerCase() === emailDigitado && obj.senha === this.senha)
      
      if (cliente) {
        sessionStorage.setItem('usuarioLogado', JSON.stringify(cliente))
        this.resetBtnEstado()
        this.router.navigate(['/solicitacaoCliente']);
        return
      }

      //Procura o funcionario
      const funcionario = this.funcionarios.find((obj: any) => obj.email?.toLowerCase() === emailDigitado && obj.senha === this.senha)
          
      if (funcionario) {
        sessionStorage.setItem('usuarioLogado', JSON.stringify(funcionario));
        this.resetBtnEstado();
        this.router.navigate(['/solicitacaoFuncionario/listar']);

        return;
      }

      // Se não encontrou ninguém
      this.resetBtnEstado();
      this.mensagemStatus = 'E-mail ou senha incorretos.';
      this.cdr.detectChanges();

    }, 500);
  }
  
  //ANIMAÇÃO BOTÃO
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

  //ANIMAÇAO MODAL
  public abrirModalEsqueciSenha(): void {
    this.emailRecuperacao = this.email
    this.erroModalRecuperacao = ''
    this.novaSenhaGerada = ''
    this.exibirModalEsqueciSenha = true
  }

  public fecharModalEsqueciSenha(): void {
    this.exibirModalEsqueciSenha = false
    this.emailRecuperacao = ''
    this.erroModalRecuperacao = ''
    this.novaSenhaGerada = ''
  }

  // FUNÇÃO AUXILIAR PARA BUSCAR E ATUALIZAR SENHA
  private redefinirSenha(chaveLocalStorage: string, emailDigitado: string): string | null {
    const lista = JSON.parse(localStorage.getItem(chaveLocalStorage) || '[]')
    const index = lista.findIndex((item: any) => item.email && item.email.toLowerCase() === emailDigitado)

    if (index === -1) return null;

    //nova senha
    const novaSenha = Math.floor(1000 + Math.random() * 9000).toString()

    //atualiza no array e grava de volta no localStorage
    lista[index].senha = novaSenha
    localStorage.setItem(chaveLocalStorage, JSON.stringify(lista)) 

    return novaSenha;
  }

  //FUNCAO ESQUECEU SENHA
  public esqueceuSenha(): void {
    const emailDigitado = this.emailRecuperacao.trim().toLowerCase();
    if (!emailDigitado) {
      this.erroModalRecuperacao = 'Por favor, informe o e-mail.';
      return;
    }

    if (!emailDigitado.includes('@') || !emailDigitado.includes('.')) {
      this.erroModalRecuperacao = 'Informe um e-mail válido.';
      return;
    }

    // tenta em clientes e se não achar tenta em funcionários
    const novaSenha = this.redefinirSenha('clientes', emailDigitado) ?? this.redefinirSenha('funcionarios', emailDigitado);

    if (!novaSenha) {
      this.erroModalRecuperacao = 'E-mail não cadastrado no sistema.';
      return;
    }

    this.novaSenhaGerada = novaSenha; 
  }
}
