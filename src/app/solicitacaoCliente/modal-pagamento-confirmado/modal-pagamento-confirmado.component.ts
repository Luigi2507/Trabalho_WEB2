import { Component, inject } from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [RouterModule],
  selector: 'app-modal-pagamento-confirmado',
  styleUrl: './modal-pagamento-confirmado.component.css',
  templateUrl: './modal-pagamento-confirmado.component.html',
})
export class ModalPagamentoConfirmadoComponent {
  public activeModal = inject(NgbActiveModal);
  private router = inject(Router);

  confirmarPagamento(){
    this.activeModal.close();
    this.router.navigate(['/solicitacaoCliente/listar']);
  }
}
