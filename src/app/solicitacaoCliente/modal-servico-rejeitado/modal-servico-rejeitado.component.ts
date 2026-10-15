import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  imports: [],
  selector: 'app-modal-servico-rejeitado',
  styleUrl: './modal-servico-rejeitado.component.css',
  templateUrl: './modal-servico-rejeitado.component.html',
})
export class ModalServicoRejeitadoComponent {
  public activeModal = inject(NgbActiveModal);
}
