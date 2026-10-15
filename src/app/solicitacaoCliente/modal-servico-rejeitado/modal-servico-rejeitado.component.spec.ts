import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalServicoRejeitadoComponent } from './modal-servico-rejeitado.component';

describe('ModalServicoRejeitadoComponent', () => {
  let component: ModalServicoRejeitadoComponent;
  let fixture: ComponentFixture<ModalServicoRejeitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalServicoRejeitadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalServicoRejeitadoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
