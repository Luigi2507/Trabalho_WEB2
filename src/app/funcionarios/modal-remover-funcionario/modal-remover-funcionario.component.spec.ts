import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRemoverFuncionarioComponent } from './modal-remover-funcionario.component';

describe('ModalRemoverFuncionarioComponent', () => {
  let component: ModalRemoverFuncionarioComponent;
  let fixture: ComponentFixture<ModalRemoverFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRemoverFuncionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRemoverFuncionarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
