import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioOrcamentoSolicitacaoComponent } from './funcionario-orcamento-solicitacao.component';

describe('FuncionarioOrcamentoSolicitacaoComponent', () => {
  let component: FuncionarioOrcamentoSolicitacaoComponent;
  let fixture: ComponentFixture<FuncionarioOrcamentoSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioOrcamentoSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionarioOrcamentoSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
