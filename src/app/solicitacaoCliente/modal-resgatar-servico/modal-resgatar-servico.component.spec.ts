import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalResgatarServicoComponent } from './modal-resgatar-servico.component';

describe('ModalResgatarServicoComponent', () => {
  let component: ModalResgatarServicoComponent;
  let fixture: ComponentFixture<ModalResgatarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalResgatarServicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalResgatarServicoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
