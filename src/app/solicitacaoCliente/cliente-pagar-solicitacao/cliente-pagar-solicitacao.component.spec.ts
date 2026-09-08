import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePagarSolicitacaoComponent } from './cliente-pagar-solicitacao.component';

describe('ClientePagarSolicitacaoComponent', () => {
  let component: ClientePagarSolicitacaoComponent;
  let fixture: ComponentFixture<ClientePagarSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientePagarSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientePagarSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
