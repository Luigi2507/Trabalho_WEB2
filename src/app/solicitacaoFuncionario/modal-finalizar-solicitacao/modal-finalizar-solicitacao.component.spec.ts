import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFinalizarSolicitacaoComponent } from './modal-finalizar-solicitacao.component';

describe('ModalFinalizarSolicitacaoComponent', () => {
  let component: ModalFinalizarSolicitacaoComponent;
  let fixture: ComponentFixture<ModalFinalizarSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFinalizarSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFinalizarSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
