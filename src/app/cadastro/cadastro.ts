import { Component, inject,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro {
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
}
