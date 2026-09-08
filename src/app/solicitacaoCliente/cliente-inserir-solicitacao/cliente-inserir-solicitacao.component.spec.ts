import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteInserirSolicitacaoComponent } from './cliente-inserir-solicitacao.component';

describe('ClienteInserirSolicitacaoComponent', () => {
  let component: ClienteInserirSolicitacaoComponent;
  let fixture: ComponentFixture<ClienteInserirSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteInserirSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteInserirSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
