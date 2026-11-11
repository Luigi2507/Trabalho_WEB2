import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm} from '@angular/forms';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  selector: 'app-editar-categoria-equipamento',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar-categoria-equipamento.component.html',
  styleUrl: './editar-categoria-equipamento.component.css',
})

export class EditarCategoriaEquipamentoComponent implements OnInit {
  categoria = signal(new CategoriaEquipamento());
  mensagem = signal('');

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriaEquipamentoService = inject(CategoriaEquipamentoService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(!id){
      this.router.navigate(['/categorias/listar']);
      return;
    }

    this.categoriaEquipamentoService.buscarPorId(id).subscribe({
      next : (dados) => {
        if(dados)
          this.categoria.set(dados);
      },
      error: () => {
        alert('Categoria não encontrada.');
        this.router.navigate(['/categorias/listar']);
      }
    });
  }

  salvar(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const {id, nome} = this.categoria();
    if(id === undefined){
      this.mensagem.set('Categoria inválida.');
      return;
    }

    this.categoriaEquipamentoService.alterar(id, {nome}).subscribe({
      next: () => this.router.navigate(['/categorias/listar']),
      error: (e: HttpErrorResponse) => {
        if (e.status === 404) {
          this.mensagem.set('Categoria não encontrada.');
        } else if (e.status === 409) {
          this.mensagem.set('Já existe uma categoria com esse nome.');
        } else if (e.status === 400) {
          this.mensagem.set('Nome inválido.');
        } else if (e.status === 0) {
          this.mensagem.set('Não foi possível conectar ao servidor.');
        } else {
          this.mensagem.set('Erro ao alterar categoria.');
        }
      }
    });
  }
}