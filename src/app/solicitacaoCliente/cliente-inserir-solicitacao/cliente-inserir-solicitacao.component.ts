import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';

@Component({
  selector: 'app-cliente-inserir-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-inserir-solicitacao.component.html',
  styleUrl: './cliente-inserir-solicitacao.component.css',
})
export class ClienteInserirSolicitacaoComponent {
  @ViewChild('formSolicitacao') formulario!: NgForm;
  solicitacao : Solicitacao = new Solicitacao();
  private solicitacaoService = inject(SolicitacaoService);
  private router = inject(Router)

  inserir() : void {
    if(this.formulario.form.valid){
      //recupera os dados do cliente em solicitcao
      const usuarioLogado = JSON.parse(
        localStorage.getItem('usuarioLogado') || '{}' 
      );

      //associa solicitacao com cpf
      this.solicitacao.clienteCpf = usuarioLogado.cpf;
      this.solicitacao.clienteNome = usuarioLogado.nome;
      this.solicitacaoService.inserir(this.solicitacao)
      this.router.navigate(['/solicitacaoCliente/listar'])
    }
  }

  sair($event: any): void {
    $event.preventDefault();
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
