import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirCategoriaEquipamentoComponent } from './inserir-categoria-equipamento.component';

describe('InserirCategoriaEquipamentoComponent', () => {
  let component: InserirCategoriaEquipamentoComponent;
  let fixture: ComponentFixture<InserirCategoriaEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserirCategoriaEquipamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InserirCategoriaEquipamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
