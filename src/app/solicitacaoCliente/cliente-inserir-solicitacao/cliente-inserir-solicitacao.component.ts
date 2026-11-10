import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, ViewChild, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared/models/solicitacao.model';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-cliente-inserir-solicitacao',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-inserir-solicitacao.component.html',
  styleUrl: './cliente-inserir-solicitacao.component.css',
})

export class ClienteInserirSolicitacaoComponent implements OnInit {

  categorias = signal<CategoriaEquipamento[]>([]);

  @ViewChild('formSolicitacao') formulario!: NgForm;
  solicitacao : Solicitacao = new Solicitacao();
  categoriaId: number | null = null;
  private enviando = false;
  private solicitacaoService = inject(SolicitacaoService);
  private categoriaEquipamentoService = inject(CategoriaEquipamentoService);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private platformId = inject(PLATFORM_ID);
  
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.categoriaEquipamentoService.listarAtivas().subscribe({
      next: (data: CategoriaEquipamento[] | null) => this.categorias.set(data ?? []),
      error: () => alert('Não foi possível carregar as categorias. Tente novamente.')
    });
  }

  //CRIAR UMA SOLICITAÇÃO
  inserir() : void {
    if (this.enviando || !this.formulario.form.valid || this.categoriaId === null) return;

    //quem está logado é o cliente dono da solicitação
    const clienteId = this.loginService.usuarioLogado()?.id;
    if (!clienteId) {
      this.router.navigate(['/login']);
      return;
    }

    this.enviando = true;
    this.solicitacaoService.inserir({
      clienteId: clienteId,
      categoriaId: this.categoriaId,
      descricaoEquipamento: this.solicitacao.descricaoEquipamento,
      descricaoDefeito: this.solicitacao.descricaoDefeito
    }).subscribe({
      next: () => this.router.navigate(['/solicitacaoCliente/listar']),
      error: (e: HttpErrorResponse) => {
        this.enviando = false;
        if (e.status === 400 || e.status === 404) {
          alert('Dados inválidos. Confira as informações e tente novamente.');
        } else {
          alert('Não foi possível registrar a solicitação. Tente novamente.');
        }
      }
    });
  }

  sair($event: any): void {
    $event.preventDefault();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}