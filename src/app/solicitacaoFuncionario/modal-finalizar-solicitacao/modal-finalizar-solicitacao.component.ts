import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { Solicitacao } from '../../shared';

@Component({
  imports: [],
  selector: 'app-modal-finalizar-solicitacao',
  styleUrl: './modal-finalizar-solicitacao.component.css',
  templateUrl: './modal-finalizar-solicitacao.component.html',
})
export class ModalFinalizarSolicitacaoComponent {
  @Input() solicitacao! : Solicitacao;
  public activeModal = inject(NgbActiveModal);

  confirmarFinalizacao(confirmar : boolean){
    this.activeModal.close(confirmar);
  }

}
