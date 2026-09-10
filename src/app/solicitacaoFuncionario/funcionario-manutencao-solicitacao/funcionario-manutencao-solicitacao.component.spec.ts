import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioManutencaoSolicitacaoComponent } from './funcionario-manutencao-solicitacao.component';

describe('FuncionarioManutencaoSolicitacaoComponent', () => {
  let component: FuncionarioManutencaoSolicitacaoComponent;
  let fixture: ComponentFixture<FuncionarioManutencaoSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioManutencaoSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionarioManutencaoSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
