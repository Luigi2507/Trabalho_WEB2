import { Component, inject, Inject, input, Input } from '@angular/core';
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

  public confirmarRemocao(confirmar : boolean) : void{
    this.activeModal.close(confirmar);
  }
}
