import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioHome } from './funcionario-home';

describe('FuncionarioHome', () => {
  let component: FuncionarioHome;
  let fixture: ComponentFixture<FuncionarioHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioHome],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionarioHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
