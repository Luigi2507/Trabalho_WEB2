import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Funcionario } from '../shared/models/funcionario.model';

@Injectable({ providedIn: 'root' })
  export class FuncionarioService {
    BASE_URL = "http://localhost:3000/funcionarios";
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    private httpClient = inject(HttpClient);

    listarTodos(): Observable<Funcionario[]> {
      return this.httpClient.get<Funcionario[]>(this.BASE_URL, this.httpOptions);
    }

    buscarPorID(id: number): Observable<Funcionario> {
      return this.httpClient.get<Funcionario>(this.BASE_URL + "/" + id, this.httpOptions);
    }

    inserir(funcionario: Funcionario): Observable<string | null> {
      return this.listarTodos().pipe(
        switchMap(funcionarios => {
          const emailExiste = funcionarios.some(
            f => f.email.toLowerCase() === funcionario.email.toLowerCase()
          );
          if (emailExiste) return of('Este e-mail já está cadastrado.');

          // o id é gerado pelo json-server
          const { id, ...dados } = funcionario;
          return this.httpClient.post<Funcionario>(this.BASE_URL, JSON.stringify(dados), this.httpOptions)
            .pipe(map(() => null));
        })
      );
    }

    atualizar(funcionario: Funcionario): Observable<Funcionario> {
      return this.httpClient.put<Funcionario>(this.BASE_URL + "/" + funcionario.id,
        JSON.stringify(funcionario), this.httpOptions);
    }

    remover(id: number, idLogado: number): Observable<string | null> {
      return this.listarTodos().pipe(
        switchMap(funcionarios => {
          if (id === idLogado) return of('Você não pode remover a si mesmo.');
          if (funcionarios.length <= 1) {
            return of('Não é possível remover o único funcionário cadastrado.');
          }
          return this.httpClient.delete<Funcionario>(this.BASE_URL + "/" + id, this.httpOptions)
            .pipe(map(() => null));
        })
      );
    }
}