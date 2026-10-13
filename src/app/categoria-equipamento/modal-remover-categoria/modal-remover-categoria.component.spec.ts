import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRemoverCategoriaComponent } from './modal-remover-categoria.component';

describe('ModalRemoverCategoriaComponent', () => {
  let component: ModalRemoverCategoriaComponent;
  let fixture: ComponentFixture<ModalRemoverCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRemoverCategoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRemoverCategoriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
