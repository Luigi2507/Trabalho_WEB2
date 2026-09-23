import { Component, inject,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

//Chave para o localStorage
const LS_CHAVE_CLIENTES = 'clientes';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro {
  private router = inject(Router);
  public etapaAtual: number = 1; //CONTROLE DE ETAPAS (1-DADOS PESSOAIS / 2- ENDEREÇO)
  public erroEtapa1: string = ''; // mensagem de erro exibida se a validação falhar
  
  //DADOS PESSOAIS
  public cpf : string = '';
  public nome : string = '';
  public email : string = '';
  public telefone : string = '';
  
  //DADOS DE ENDEREÇO
  public cep : string = '';
  public logradouro : string = '';
  public numero : string = '';
  public complemento : string = '';
  public bairro : string = '';
  public cidade : string = '';
  public estado : string = '';
  
  //VIACEP -> requisição HTTP
  private http = inject(HttpClient);

  //BOTÃO CADASTRAR-SE
  public carregandoDados: boolean = false;
  public bloqueado: boolean = false;
  public btnCadastroTexto: string = 'Cadastrar-se';

  //MENSAGENS DE ERRO
  public mensagemEmail: string = '';
  public mensagemCPF: string = '';
  
  //MÁSCARAS
  public formatarCPF(): void {
    let cpf = this.cpf.replace(/\D/g, '');
    cpf = cpf.substring(0,11);

    if (cpf.length > 9) {
      cpf = cpf.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            '$1.$2.$3-$4'
      );
    } else if (cpf.length > 6) {
      cpf = cpf.replace(
            /^(\d{3})(\d{3})(\d{1,3})$/,
            '$1.$2.$3'
      );
    } else if (cpf.length > 3) {
      cpf = cpf.replace(
            /^(\d{3})(\d{1,3})$/,
            '$1.$2'
      );
    }
    this.cpf = cpf;
  }

  public formatarTelefone(): void {
    let telefone = this.telefone.replace(/\D/g, '');
    telefone = telefone.substring(0, 11);

    if (telefone.length > 7) {
      telefone = telefone.replace(
                  /^(\d{2})(\d{5})(\d{1,4})$/,
                 '($1) $2-$3'
      );
    } else if (telefone.length > 2) {
        telefone = telefone.replace(
                    /^(\d{2})(\d{1,5})$/,
                    '($1) $2'
        )
    }
    this.telefone = telefone;
  }

  public formatarCEP(): void {
    let cep = this.cep.replace(/\D/g, '');
    cep = cep.substring(0, 8);

    if (cep.length > 5) {
      cep = cep.replace(
              /^(\d{5})(\d{1,3})$/,
              '$1-$2'
      )
    }
    this.cep = cep;

    this.buscarCEP();
  }

  public somenteNumeros() {
    this.numero = this.numero.replace(/\D/g, '');
  }

  //AUTOCOMPLETAR VIACEP
  public mensagemCEP: string = '';

  public buscarCEP(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');

    if (cepLimpo.length != 8) {
      this.mensagemCEP = '';
      return;
    }

    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .subscribe({next: dados => {
        if (dados.erro) {
          this.mensagemCEP = 'CEP não encontrado.';
          this.logradouro = '';
          this.bairro = '';
          this.cidade = '';
          this.estado = '';
          return;
        } 

        this.mensagemCEP = '';
        this.logradouro = dados.logradouro;
        this.bairro = dados.bairro;
        this.cidade = dados.localidade;
        this.estado = dados.uf;
      },
      error: () => {
        this.mensagemCEP = 'CEP inválido';
      }
    });
  }

  //VALIDAR CAMPOS
  public proximaEtapa(): void {
    this.formatarCPF();       
    this.formatarTelefone(); 

    this.erroEtapa1 = '';
    this.mensagemCPF = '';
    this.mensagemEmail = '';

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);

    if (!this.nome.trim()) {
      this.erroEtapa1 = 'Informe seu nome completo.';
      return;
    }
    if (this.cpf.length !== 14) { 
      this.erroEtapa1 = 'CPF inválido.';
      return;
    }
    if (!emailValido) {
      this.erroEtapa1 = 'Informe um e-mail válido.';
      return;
    }
    if (this.telefone.length < 14) {
      this.erroEtapa1 = 'Telefone inválido.';
      return;
    }

    const clientesSalvos = localStorage.getItem(LS_CHAVE_CLIENTES);
      const clientes = clientesSalvos ? JSON.parse(clientesSalvos) : [];

      const emailExiste = clientes.some(
        (cliente: any) => cliente.email.toLowerCase() === this.email.toLowerCase()
      );

      if (emailExiste) {
        this.mensagemEmail = 'Este e-mail já está cadastrado.';
        return;
      }

      const cpfExiste = clientes.some(
        (cliente: any) => cliente.cpf === this.cpf
      );

      if (cpfExiste) {
        this.mensagemCPF = 'Este CPF já está cadastrado.';
        return;
      }

      this.etapaAtual = 2;
  }

  //VOLTA PRA ETAPA DE DADOS PESSOAIS
  public voltarEtapa(): void {
    this.etapaAtual = 1;
  }

  //MÉTODOS DO BOTÃO CADASTRAR-SE
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

  /* GERAR SENHA */
  public gerarSenha(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  //MODAL PARA EXIBIR A SENHA GERADA
  public exibirModalSenhaGerada: boolean = false;
  public senhaGerada: string = '';

  public abrirModalSenhaGerada(senha: string): void{
    this.senhaGerada = senha;
    this.exibirModalSenhaGerada = true;
  }

  public fecharModalSenhaGerada(): void{
    this.exibirModalSenhaGerada = false;
    this.senhaGerada = '';
    this.router.navigate(['/login']);
  }

  // CADASTRAR DE FATO E CONFERIR DADOS
  public cadastrar(): void {
    /*CONFERIR ENDEREÇO ANTES DE CADASTRAR DE FATO*/
      const cepLimpo = this.cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) {
          this.mensagemCEP = 'Informe um CEP válido.';
          return;
      }

      if (!this.numero.trim()) {
          this.mensagemCEP = 'Informe o número do endereço.';
          return;
      }

      if (!this.logradouro || !this.bairro || !this.cidade || !this.estado ) {
          this.mensagemCEP = 'Consulte um CEP válido.';
          return;
      }

      this.mensagemCEP = '';

      //busca clientes já cadastrados
      const clientesSalvos = localStorage.getItem(LS_CHAVE_CLIENTES);

      const clientes = clientesSalvos ? JSON.parse(clientesSalvos) : [];

      const senha = this.gerarSenha();

      const cliente = {
        cpf: this.cpf,
        nome: this.nome,
        email: this.email,
        telefone: this.telefone,
        cep: this.cep,
        logradouro: this.logradouro,
        numero: this.numero,
        complemento: this.complemento,
        bairro: this.bairro,
        cidade: this.cidade,
        estado: this.estado,
        senha: senha,
        perfil: 'CLIENTE'
      };

      clientes.push(cliente);
      
      //por enquanto vamos salvar no localStorage
      localStorage.setItem(LS_CHAVE_CLIENTES, JSON.stringify(clientes));
      
      this.btnCadastroAnimacao();

      // Para mostrar a senha gerada
      setTimeout(() => {this.abrirModalSenhaGerada(senha)}, 2000);
  }
}
