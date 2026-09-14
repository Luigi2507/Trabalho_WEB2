import { Component, OnInit } from '@angular/core';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-categoria-equipamento',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-categoria-equipamento.component.html',
  styleUrl: './listar-categoria-equipamento.component.css',
})
export class ListarCategoriaEquipamentoComponent implements OnInit {


  categorias: CategoriaEquipamento[] = [];

  constructor(private categoriaEquipamentoService: CategoriaEquipamentoService) { }

ngOnInit(): void {
  this.categorias = this.categoriaEquipamentoService.listarTodos();
  }

  remover($event: any, categoria: CategoriaEquipamento): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover a categoria ${categoria.nome}?`)) {
      this.categoriaEquipamentoService.remover(categoria.id!);
      this.categorias = this.categoriaEquipamentoService.listarTodos();
    }
  }
}
