import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Funcionario } from '../../shared/models/funcionario.model';
import { CaixaAltaPipe } from '../../shared/pipes';
import { DatePipe } from '@angular/common';

@Component({
  imports: [CaixaAltaPipe, DatePipe],
  selector: 'app-modal-funcionario',
  styleUrl: './modal-funcionario.component.css',
  templateUrl: './modal-funcionario.component.html',
})
export class ModalFuncionarioComponent {
  @Input() funcionario!: Funcionario;
  public activeModal = inject(NgbActiveModal);
}
