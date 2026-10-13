import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CaixaAltaPipe } from '../../shared/pipes';
import { ModalRemoverCategoriaComponent } from '../modal-remover-categoria/modal-remover-categoria.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listar-categoria-equipamento',
  imports: [CommonModule, RouterLink, CaixaAltaPipe],
  templateUrl: './listar-categoria-equipamento.component.html',
  styleUrl: './listar-categoria-equipamento.component.css',
})

export class ListarCategoriaEquipamentoComponent implements OnInit {
  categorias = signal<CategoriaEquipamento[]>([]);
  private modalService = inject(NgbModal);

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

  async remover($event: any, categoria: CategoriaEquipamento): Promise<void> {
    $event.preventDefault();

    let confirmar = await this.abrirModalRemoverCategoria(categoria);
    if(!confirmar) return;

    this.categoriaEquipamentoService.remover(categoria.id!).subscribe({
      complete: () => { this.listarTodos(); }
    });
  }

  abrirModalRemoverCategoria(categoria : CategoriaEquipamento) : Promise<boolean>{
    const modalRef = this.modalService.open(ModalRemoverCategoriaComponent);
    modalRef.componentInstance.categoria = categoria;

    return modalRef.result.then(
      (resultado : boolean) => resultado,
      () => false
    );
  }
}