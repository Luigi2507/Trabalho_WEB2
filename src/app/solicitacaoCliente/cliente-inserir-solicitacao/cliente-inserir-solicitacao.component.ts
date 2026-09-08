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
      this.solicitacaoService.inserir(this.solicitacao)
      this.router.navigate(['/solicitacaoCliente/listar'])
    }
  }
}
