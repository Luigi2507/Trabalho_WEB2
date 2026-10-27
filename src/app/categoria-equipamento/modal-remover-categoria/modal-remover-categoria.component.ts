import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaEquipamento } from '../../shared';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  imports: [],
  selector: 'app-modal-remover-categoria',
  styleUrl: './modal-remover-categoria.component.css',
  templateUrl: './modal-remover-categoria.component.html',
})
export class ModalRemoverCategoriaComponent {
  @Input() categoria! : CategoriaEquipamento;
  public activeModal = inject(NgbActiveModal);
  private categoriaEquipamentoService = inject(CategoriaEquipamentoService);

  mensagem = signal('');
  processando = signal(false);

  public confirmarRemocao(confirmar : boolean) : void{
    if(!confirmar){
      this.activeModal.close(confirmar);
      return;
    }

    if(this.categoria.id === undefined){
      this.mensagem.set('Categoria inválida.');
      return;
    }

    this.processando.set(true);
    this.mensagem.set('');

    this.categoriaEquipamentoService.remover(this.categoria.id).subscribe({
        next: () => this.activeModal.close(true),
        error: (e) => {
          this.processando.set(false);      
          this.mensagem.set(e.status === 404 ? 'Categoria não encontrada.' : 'Erro ao remover categoria.')
      }
    });
   
  }
}
