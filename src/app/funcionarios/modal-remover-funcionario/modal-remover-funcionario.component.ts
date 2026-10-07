import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  imports: [],
  selector: 'app-modal-remover-funcionario',
  styleUrl: './modal-remover-funcionario.component.css',
  templateUrl: './modal-remover-funcionario.component.html',
})
export class ModalRemoverFuncionarioComponent {
  @Input() funcionario!: Funcionario;
  public activeModal = inject(NgbActiveModal);

  public confirmarRemocao(confirmar : boolean) : void{
    this.activeModal.close(confirmar);
  }
}
