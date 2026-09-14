import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCategoriaEquipamentoComponent } from './editar-categoria-equipamento.component';

describe('EditarCategoriaEquipamentoComponent', () => {
  let component: EditarCategoriaEquipamentoComponent;
  let fixture: ComponentFixture<EditarCategoriaEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCategoriaEquipamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarCategoriaEquipamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
