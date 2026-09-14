import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, OnInit} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  selector: 'app-cliente-inserir-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-inserir-solicitacao.component.html',
  styleUrl: './cliente-inserir-solicitacao.component.css',
})

export class ClienteInserirSolicitacaoComponent implements OnInit {

  categorias: CategoriaEquipamento[] = [];

  @ViewChild('formSolicitacao') formulario!: NgForm;
  solicitacao : Solicitacao = new Solicitacao();
  private solicitacaoService = inject(SolicitacaoService);
  private categoriaEquipamentoService = inject(CategoriaEquipamentoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.categorias = this.categoriaEquipamentoService.listarTodos();
  }

  //CRIAR UMA SOLICITAÇÃO
  inserir() : void {
    if(this.formulario.form.valid){
      //recupera a sessao do cliente 
      const usuarioLogado = JSON.parse(
        sessionStorage.getItem('usuarioLogado') || '{}' 
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
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
