import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  selector: 'app-inserir-categoria-equipamento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inserir-categoria-equipamento.component.html',
  styleUrl: './inserir-categoria-equipamento.component.css',
})
export class InserirCategoriaEquipamentoComponent {
  categoria: CategoriaEquipamento = new CategoriaEquipamento();
  mensagem = signal('');
  private enviando = false;

  private categoriaEquipamentoService = inject(CategoriaEquipamentoService);
  private router = inject(Router);


  salvar(form: NgForm): void {
    if (form.invalid || this.enviando) {
      return;
    }
    this.enviando = true;
    this.mensagem.set('');

    this.categoriaEquipamentoService.inserir(this.categoria).subscribe({
      next: () => this.router.navigate(['/categorias/listar']),
      error: (e: HttpErrorResponse) => {
        this.enviando = false;
        if (e.status === 409) {
          this.mensagem.set('Já existe uma categoria com esse nome.');
        } else if (e.status === 400) {
          this.mensagem.set('Nome inválido.');
        } else if (e.status === 0) {
          this.mensagem.set('Não foi possível conectar ao servidor.');
        } else {
          this.mensagem.set('Erro ao cadastrar categoria.');
        }
      }
    });
  }
}