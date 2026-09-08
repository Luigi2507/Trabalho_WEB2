import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteListarSolicitacaoComponent } from './cliente-listar-solicitacao.component';

describe('ClienteListarSolicitacaoComponent', () => {
  let component: ClienteListarSolicitacaoComponent;
  let fixture: ComponentFixture<ClienteListarSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteListarSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteListarSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
