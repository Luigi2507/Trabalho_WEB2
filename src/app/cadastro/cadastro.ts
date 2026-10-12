import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NumericoDirective } from '../shared/directives/numerico.directive';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfValidoDirective } from '../shared/directives/cpf-valido.directive';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink, NgxMaskDirective, NumericoDirective, CpfValidoDirective],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro {
  private router = inject(Router);
  public etapaAtual = signal(1); //CONTROLE DE ETAPAS (1-DADOS PESSOAIS / 2- ENDEREÇO)
  public erroEtapa1 = signal(''); // mensagem de erro exibida se a validação falhar
  private clienteService = inject(ClienteService);
  
  //DADOS PESSOAIS
  public cpf : string = '';
  public nome : string = '';
  public email : string = '';
  public telefone : string = '';
  
  //DADOS DE ENDEREÇO
  public cep : string = '';
  public numero : string = '';
  public complemento : string = '';
  public logradouro = signal('');
  public bairro = signal('');
  public cidade = signal('');
  public estado = signal('');
  
  //VIACEP -> requisição HTTP
  private http = inject(HttpClient);

  //BOTÃO CADASTRAR-SE
  public carregandoDados: boolean = false;
  public bloqueado = signal(false);
  public btnCadastroTexto = signal('Cadastrar-se');

  //MENSAGENS DE ERRO
  public mensagemEmail = signal('');
  public mensagemCPF = signal('');
 
  //AUTOCOMPLETAR VIACEP
  public mensagemCEP = signal('');

  public buscarCEP(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');

    if (cepLimpo.length != 8) {
      this.mensagemCEP.set('');
      return;
    }

    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .subscribe({next: dados => {
        if (dados.erro) {
          this.mensagemCEP.set('CEP não encontrado.');
          this.logradouro.set('');
          this.bairro.set('');
          this.cidade.set('');
          this.estado.set('');
          return;
        } 
 
        this.mensagemCEP.set('');
        this.logradouro.set(dados.logradouro);
        this.bairro.set(dados.bairro);
        this.cidade.set(dados.localidade);
        this.estado.set(dados.uf);
      },
      error: () => {
        this.mensagemCEP.set('CEP inválido');
      }
    });
  }

  //VALIDAR CAMPOS
  public proximaEtapa(cpfInvalido: boolean | null): void {
    this.erroEtapa1.set('');
    this.mensagemCPF.set('');
    this.mensagemEmail.set('');
 
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
 
    if (!this.nome.trim()) {
      this.erroEtapa1.set('Informe seu nome completo.');
      return;
    }
    if (this.cpf.length !== 14 || cpfInvalido) {
      this.erroEtapa1.set('CPF inválido.');
      return;
    }
    if (!emailValido) {
      this.erroEtapa1.set('Informe um e-mail válido.');
      return;
    }
    if (this.telefone.length < 14) {
      this.erroEtapa1.set('Telefone inválido.');
      return;
    }
 
    // confere no json-server se e-mail e CPF já estão cadastrados
    this.clienteService.listarTodos().subscribe({
      next: clientes => {
        const emailExiste = clientes.some(
          cliente => cliente.email.toLowerCase() === this.email.toLowerCase()
        );
 
        if (emailExiste) {
          this.mensagemEmail.set('Este e-mail já está cadastrado.');
          return;
        }
 
        const cpfExiste = clientes.some(
          cliente => cliente.cpf === this.cpf
        );
 
        if (cpfExiste) {
          this.mensagemCPF.set('Este CPF já está cadastrado.');
          return;
        }
 
        this.etapaAtual.set(2);
      },
      error: () => {
        this.erroEtapa1.set('Não foi possível conectar ao servidor. Tente novamente.');
      }
    });
  }

  //VOLTA PRA ETAPA DE DADOS PESSOAIS
  public voltarEtapa(): void {
    this.etapaAtual.set(1);
  }

  public resetBtnCadastro(): void{
    this.bloqueado.set(false);
    this.btnCadastroTexto.set('Cadastrar-se');
  }

  /* GERAR SENHA */
  public gerarSenha(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  //MODAL PARA EXIBIR A SENHA GERADA
  public exibirModalSenhaGerada = signal(false);
  public senhaGerada = signal('');
 
  public abrirModalSenhaGerada(senha: string): void{
    this.senhaGerada.set(senha);
    this.exibirModalSenhaGerada.set(true);
  }
 
  public fecharModalSenhaGerada(): void{
    this.exibirModalSenhaGerada.set(false);
    this.senhaGerada.set('');
    this.router.navigate(['/login']);
  }

  // CADASTRAR DE FATO E CONFERIR DADOS
  public cadastrar(): void {
   if(this.bloqueado()) return; //trava clique duplo
    /*CONFERIR ENDEREÇO ANTES DE CADASTRAR DE FATO*/
      const cepLimpo = this.cep.replace(/\D/g, '');
 
      if (cepLimpo.length !== 8) {
          this.mensagemCEP.set('Informe um CEP válido.');
          return;
      }
 
      if (!this.numero.trim()) {
          this.mensagemCEP.set('Informe o número do endereço.');
          return;
      }
 
      if (!this.logradouro() || !this.bairro() || !this.cidade() || !this.estado() ) {
          this.mensagemCEP.set('Consulte um CEP válido.');
          return;
      }
 
      this.mensagemCEP.set('');
 
      this.bloqueado.set(true);
      this.btnCadastroTexto.set('Cadastro em Andamento...');
 
      const senha = this.gerarSenha();
 
      // o id é gerado pelo json-server
      const cliente = {
        cpf: this.cpf,
        nome: this.nome,
        email: this.email,
        telefone: this.telefone,
        cep: this.cep,
        logradouro: this.logradouro(),
        numero: this.numero,
        complemento: this.complemento,
        bairro: this.bairro(),
        cidade: this.cidade(),
        estado: this.estado(),
        senha: senha,
        perfil: 'CLIENTE'
      };
 
      // grava o cliente no json-server e, se deu certo, mostra a senha gerada
      this.clienteService.inserir(cliente).subscribe({
        next: () => {
          this.resetBtnCadastro();
          this.abrirModalSenhaGerada(senha);
        },
        error: () => {
          this.resetBtnCadastro();
          this.mensagemCEP.set('Não foi possível concluir o cadastro. Tente novamente.');
        }
      });
    }
}
