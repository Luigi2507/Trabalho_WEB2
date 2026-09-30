import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFuncionarioComponent } from './modal-funcionario.component';

describe('ModalFuncionarioComponent', () => {
  let component: ModalFuncionarioComponent;
  let fixture: ComponentFixture<ModalFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFuncionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFuncionarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
