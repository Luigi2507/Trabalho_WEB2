import { TestBed } from '@angular/core/testing';
import { SolicitacaoClienteService } from './solicitacao-cliente.service';

describe('SolicitacaoClienteService', () => {
  let service: SolicitacaoClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitacaoClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
