import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCategoriaEquipamentoComponent } from './listar-categoria-equipamento.component';

describe('ListarCategoriaEquipamentoComponent', () => {
  let component: ListarCategoriaEquipamentoComponent;
  let fixture: ComponentFixture<ListarCategoriaEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCategoriaEquipamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarCategoriaEquipamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
