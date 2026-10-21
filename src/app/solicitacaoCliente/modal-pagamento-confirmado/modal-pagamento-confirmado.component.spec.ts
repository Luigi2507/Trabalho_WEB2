import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPagamentoConfirmadoComponent } from './modal-pagamento-confirmado.component';

describe('ModalPagamentoConfirmadoComponent', () => {
  let component: ModalPagamentoConfirmadoComponent;
  let fixture: ComponentFixture<ModalPagamentoConfirmadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPagamentoConfirmadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPagamentoConfirmadoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
