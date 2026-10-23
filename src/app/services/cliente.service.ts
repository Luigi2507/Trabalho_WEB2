import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from '../shared/models/cliente.model';

export interface VerificacaoCliente {
  emailCadastrado: boolean;
  cpfCadastrado: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  BASE_URL = "http://localhost:8080/clientes";
  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private httpClient = inject(HttpClient);

  //etapa 1 do cadastro: pergunta ao back se o e-mail/CPF já existem
  verificar(cpf: string, email: string): Observable<VerificacaoCliente | null> {
    const url = `${this.BASE_URL}/verificar?cpf=${encodeURIComponent(cpf)}&email=${encodeURIComponent(email)}`;
    return this.httpClient.get<VerificacaoCliente>(url, this.httpOptions).pipe(
      map((resp: HttpResponse<VerificacaoCliente>) => resp.status == 200 ? resp.body : null),
      catchError((e) => throwError(() => e)) // relança: a tela decide a mensagem
    );
  }
  
  inserir(cliente: Partial<Cliente>): Observable<Partial<Cliente> | null> {
    const { id, senha, perfil, ...dados } = cliente; // senha e perfil são do back
    return this.httpClient.post<Partial<Cliente>>(this.BASE_URL, JSON.stringify(dados), this.httpOptions).pipe(
      map((resp: HttpResponse<Partial<Cliente>>) => resp.status == 201 ? resp.body : null),
      catchError((e) => throwError(() => e))
    );
  }
}