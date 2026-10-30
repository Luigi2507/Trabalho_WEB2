import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Funcionario } from '../shared/models/funcionario.model';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  BASE_URL = "http://localhost:8080/funcionarios";
  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private httpClient = inject(HttpClient);

  listarTodos(): Observable<Funcionario[]> {
    return this.httpClient.get<Funcionario[]>(this.BASE_URL, this.httpOptions).pipe(
      map((resp: HttpResponse<Funcionario[]>) => resp.body ?? []),
      catchError((e) => throwError(() => e))
    );
  }

  buscarPorID(id: number): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(this.BASE_URL + "/" + id, this.httpOptions).pipe(
      map((resp: HttpResponse<Funcionario>) => resp.body as Funcionario),
      catchError((e) => throwError(() => e))
    );
  }

  inserir(funcionario: Funcionario): Observable<Funcionario> {
    const { nome, email, dataNascimento } = funcionario;
    return this.httpClient.post<Funcionario>(this.BASE_URL, JSON.stringify({ nome, email, dataNascimento }), this.httpOptions).pipe(
      map((resp: HttpResponse<Funcionario>) => resp.body as Funcionario),
      catchError((e) => throwError(() => e))
    );
  }

  atualizar(funcionario: Funcionario): Observable<Funcionario> {
    const { nome, email, dataNascimento } = funcionario;
    return this.httpClient.put<Funcionario>(this.BASE_URL + "/" + funcionario.id, JSON.stringify({ nome, email, dataNascimento }), this.httpOptions).pipe(
      map((resp: HttpResponse<Funcionario>) => resp.body as Funcionario),
      catchError((e) => throwError(() => e))
    );
  }

  remover(id: number, idLogado: number): Observable<string | null> {
    return this.httpClient.delete<void>(this.BASE_URL + "/" + id + "?idLogado=" + idLogado, this.httpOptions).pipe(
      map((): string | null => null),
      catchError((e: HttpErrorResponse) =>
        e.status === 409 ? of(e.error?.mensagem ?? 'Não foi possível remover o funcionário.')
          : throwError(() => e))
    );
  }
}