import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Funcionario } from '../../shared/models/funcionario.model';


@Component({
  imports: [],
  selector: 'app-modal-funcionario',
  styleUrl: './modal-funcionario.component.css',
  templateUrl: './modal-funcionario.component.html',
})
export class ModalFuncionarioComponent {
  @Input() funcionario!: Funcionario;
  public activeModal = inject(NgbActiveModal);
}
