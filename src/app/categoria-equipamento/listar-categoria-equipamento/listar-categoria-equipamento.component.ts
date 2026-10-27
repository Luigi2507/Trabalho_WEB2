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
    this.listarAtivas();
  }

  listarAtivas(): void {
    this.categoriaEquipamentoService.listarAtivas().subscribe({
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

    const modalRef = this.modalService.open(ModalRemoverCategoriaComponent);
    modalRef.componentInstance.categoria = categoria;

    modalRef.result.then(
      (removida : boolean) => {
        if(removida){
          this.categorias.update(lista => lista.filter(c => c.id !== categoria.id));
        }
      },
      () => {}
    );
  }
}