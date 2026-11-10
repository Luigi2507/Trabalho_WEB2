import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../shared/models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  BASE_URL = "http://localhost:8080";
  httpOptions = {
    observe: "response" as "response",
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

    private httpClient = inject(HttpClient);

    listarAbertas(): Observable<Solicitacao[]> {
        return this.httpClient.get<Solicitacao[]>(`${this.BASE_URL}/solicitacoes`, {params: {status: 'ABERTA'}});
    }

    listarTodos(): Observable<Solicitacao[]> {
        return this.httpClient.get<Solicitacao[]>(`${this.BASE_URL}/solicitacoes`);
    }

    listarDoFuncionario(funcionarioID: number): Observable<Solicitacao[]> {
        return this.httpClient.get<Solicitacao[]>(`${this.BASE_URL}/solicitacoes`, {params: {funcionarioId: funcionarioID}});
    }

    buscarPorIDFuncionario(id: number): Observable<Solicitacao> {
        return this.httpClient.get<Solicitacao>(`${this.BASE_URL}/funcionario/solicitacoes/${id}`);
    }


    orcar(id: number, funcionarioId: number, valor: number): Observable<Solicitacao> {
        return this.acaoDoFuncionario(id, funcionarioId, 'orcamento', { valor });
    }

    efetuarManutencao(id: number, funcionarioId: number, descricao: string, orientacoes: string): Observable<Solicitacao> {
        return this.acaoDoFuncionario(id, funcionarioId, 'manutencao', { descricao, orientacoes });
    }

    redirecionar(id: number, funcionarioId: number, destinoId: number): Observable<Solicitacao> {
        return this.acaoDoFuncionario(id, funcionarioId, 'redirecionar', { destinoId });
    }

    finalizar(id: number, funcionarioId: number): Observable<Solicitacao> {
        return this.acaoDoFuncionario(id, funcionarioId, 'finalizar', {});
    }

    private acaoDoFuncionario(id: number, funcionarioId: number, acao: string, corpo: object): Observable<Solicitacao> {
        return this.httpClient.put<Solicitacao>(
            `${this.BASE_URL}/solicitacoes/${id}/${acao}`, corpo, { params: { funcionarioId } });
    }
}