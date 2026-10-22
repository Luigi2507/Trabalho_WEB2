import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [],
  selector: 'app-modal-resgatar-servico',
  styleUrl: './modal-resgatar-servico.component.css',
  templateUrl: './modal-resgatar-servico.component.html',
})
export class ModalResgatarServicoComponent {
  public activeModal = inject(NgbActiveModal);
  @Input() descricao: string = '';
}
