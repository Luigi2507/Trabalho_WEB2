import { Component, OnInit, signal } from '@angular/core';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CaixaAltaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-listar-categoria-equipamento',
  imports: [CommonModule, RouterLink, CaixaAltaPipe],
  templateUrl: './listar-categoria-equipamento.component.html',
  styleUrl: './listar-categoria-equipamento.component.css',
})

export class ListarCategoriaEquipamentoComponent implements OnInit {
  categorias = signal<CategoriaEquipamento[]>([]);

  constructor(private categoriaEquipamentoService: CategoriaEquipamentoService) { }

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): void {
    this.categoriaEquipamentoService.listarTodos().subscribe({
      next: (data: CategoriaEquipamento[]) => {
        if (data == null) {
          this.categorias.set([]);
        } else {
          this.categorias.set(data);
        }
      }
    });
  }

  remover($event: any, categoria: CategoriaEquipamento): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover a categoria ${categoria.nome}?`)) {
      this.categoriaEquipamentoService.remover(categoria.id!).subscribe({
        complete: () => { this.listarTodos(); }
      });
    }
  }
}