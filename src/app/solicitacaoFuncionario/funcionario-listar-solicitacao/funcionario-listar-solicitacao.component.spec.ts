import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioListarSolicitacaoComponent } from './funcionario-listar-solicitacao.component';

describe('FuncionarioListarSolicitacaoComponent', () => {
  let component: FuncionarioListarSolicitacaoComponent;
  let fixture: ComponentFixture<FuncionarioListarSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioListarSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionarioListarSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
