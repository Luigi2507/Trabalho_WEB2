import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteVisualizarSolicitacaoComponent } from './cliente-visualizar-solicitacao.component';

describe('ClienteVisualizarSolicitacaoComponent', () => {
  let component: ClienteVisualizarSolicitacaoComponent;
  let fixture: ComponentFixture<ClienteVisualizarSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteVisualizarSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteVisualizarSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
