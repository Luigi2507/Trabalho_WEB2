import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-cadastro',
  imports: [FormsModule],
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
  public formatarCPF() {
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

  //MÉTODOS DO AUTOCOMPLETAR VIACEP
  public buscarCEP(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');

    if (cepLimpo.length != 8) {
      return;
    }

    this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .subscribe(dados => { console.log(dados); });
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
