import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoricoItem, Solicitacao } from '../shared/models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
    BASE_URL = "http://localhost:3000/solicitacoes";
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    };

    private httpClient = inject(HttpClient);

    listarTodos(): Observable<Solicitacao[]> {
        return this.httpClient.get<any[]>(this.BASE_URL, this.httpOptions).pipe(
        map(lista => lista.map(s => this.reviverDatas(s)))
        );
    }

    buscarPorID(id: number): Observable<Solicitacao> {
        return this.httpClient.get<any>(this.BASE_URL + "/" + id, this.httpOptions).pipe(
        map(s => this.reviverDatas(s))
        );
    }

    inserir(solicitacao: Solicitacao): Observable<Solicitacao> {
        const { id, ...dados } = solicitacao;
        const nova = {
        ...dados,
        dataHora: new Date(),
        status: "ABERTA",
        historico: [new HistoricoItem(new Date(), "ABERTA", `${solicitacao.clienteNome} (Cliente)`)]
        };
        return this.httpClient.post<Solicitacao>(this.BASE_URL, JSON.stringify(nova), this.httpOptions);
    }

    atualizar(solicitacao: Solicitacao): Observable<Solicitacao> {
        return this.httpClient.put<Solicitacao>(this.BASE_URL + "/" + solicitacao.id,
        JSON.stringify(solicitacao), this.httpOptions);
    }

    private reviverDatas(s: any): Solicitacao {
        s.dataHora = new Date(s.dataHora);
        s.dataPagamento = s.dataPagamento ? new Date(s.dataPagamento) : null;
        s.dataFinalizacao = s.dataFinalizacao ? new Date(s.dataFinalizacao) : null;
        s.historico = (s.historico || []).map((h: any) => ({ ...h, dataHora: new Date(h.dataHora) }));
        return s;
    }
}