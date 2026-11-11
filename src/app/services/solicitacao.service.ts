import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Solicitacao } from '../shared/models/solicitacao.model';

// dados enviados no POST /solicitacoes (igual ao SolicitacaoNovaDTO do back)
export interface NovaSolicitacao {
  clienteId: number;
  categoriaId: number;
  descricaoEquipamento: string;
  descricaoDefeito: string;
}

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

   listarPorCliente(clienteId: number): Observable<Solicitacao[] | null> {
       return this.httpClient.get<any[]>(`${this.BASE_URL}/clientes/${clienteId}/solicitacoes`, this.httpOptions).pipe(
       map((resp: HttpResponse<any[]>) =>
           resp.status == 200 ? (resp.body ?? []).map(s => this.converter(s)) : null),
       catchError((e) => throwError(() => e))
       );
   }

   buscarPorId(id: number, clienteId: number): Observable<Solicitacao | null> {
       return this.httpClient.get<any>(`${this.BASE_URL}/solicitacoes/${id}?clienteId=${clienteId}`, this.httpOptions).pipe(
       map((resp: HttpResponse<any>) =>
           resp.status == 200 && resp.body ? this.converter(resp.body) : null),
       catchError((e) => throwError(() => e))
       );
   }

   inserir(nova: NovaSolicitacao): Observable<Solicitacao | null> {
       return this.httpClient.post<any>(`${this.BASE_URL}/solicitacoes`, JSON.stringify(nova), this.httpOptions).pipe(
       map((resp: HttpResponse<any>) =>
           resp.status == 201 && resp.body ? this.converter(resp.body) : null),
       catchError((e) => throwError(() => e))
       );
   }

   aprovar(id: number, clienteId: number): Observable<Solicitacao | null> {
       return this.executarAcao(id, clienteId, 'aprovar', null);
   }

   rejeitar(id: number, clienteId: number, motivo: string): Observable<Solicitacao | null> {
       return this.executarAcao(id, clienteId, 'rejeitar', { motivo });
   }

   resgatar(id: number, clienteId: number): Observable<Solicitacao | null> {
       return this.executarAcao(id, clienteId, 'resgatar', null);
   }

   pagar(id: number, clienteId: number): Observable<Solicitacao | null> {
       return this.executarAcao(id, clienteId, 'pagar', null);
   }

   private executarAcao(id: number, clienteId: number, acao: string, corpo: object | null): Observable<Solicitacao | null> {
       return this.httpClient.put<any>(
       `${this.BASE_URL}/solicitacoes/${id}/${acao}?clienteId=${clienteId}`,
       corpo ? JSON.stringify(corpo) : null,
       this.httpOptions
       ).pipe(
       map((resp: HttpResponse<any>) =>
           resp.status == 200 && resp.body ? this.converter(resp.body) : null),
       catchError((e) => throwError(() => e))
       );
   }

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

  // o JSON traz as datas como texto: transforma em Date e troca null por valor padrão
  private converter(s: any): Solicitacao {
    s.dataHora = new Date(s.dataHora);
    s.dataPagamento = s.dataPagamento ? new Date(s.dataPagamento) : null;
    s.orcamento = s.orcamento ?? 0;
    s.motivoRejeicao = s.motivoRejeicao ?? '';
    s.historico = (s.historico ?? []).map((h: any) => ({ ...h, dataHora: new Date(h.dataHora) }));
    return s as Solicitacao;
  }
}