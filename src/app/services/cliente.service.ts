import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../shared/models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  BASE_URL = "http://localhost:3000/clientes";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private httpClient = inject(HttpClient);

  listarTodos(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.BASE_URL, this.httpOptions);
  }

  inserir(cliente: Partial<Cliente>): Observable<Cliente> {
    const { id, ...dados } = cliente;
    return this.httpClient.post<Cliente>(this.BASE_URL, JSON.stringify(dados), this.httpOptions);
  }
}