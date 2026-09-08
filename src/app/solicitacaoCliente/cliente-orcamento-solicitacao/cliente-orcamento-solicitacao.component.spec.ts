import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteOrcamentoSolicitacaoComponent } from './cliente-orcamento-solicitacao.component';

describe('ClienteOrcamentoSolicitacaoComponent', () => {
  let component: ClienteOrcamentoSolicitacaoComponent;
  let fixture: ComponentFixture<ClienteOrcamentoSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteOrcamentoSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteOrcamentoSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
