import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CategoriaEquipamento } from '../shared/models/categoria-equipamento.model';

@Injectable({ providedIn: 'root' })
export class CategoriaEquipamentoService {
    BASE_URL = "http://localhost:8080/categorias";
    httpOptions = {
        observe: "response" as "response",
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    };
    private httpClient = inject(HttpClient);

    inserir(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento | null> {
        const { id, ativo, ...dados } = categoria; // o id e o ativo são preenchidos pelo back-end
        return this.httpClient.post<CategoriaEquipamento>(this.BASE_URL, JSON.stringify(dados), this.httpOptions).pipe(
            map((resp: HttpResponse<CategoriaEquipamento>) => resp.status == 201 ? resp.body : null),
            catchError((e) => throwError(() => e))
        );
    }

    listarAtivas(): Observable<CategoriaEquipamento[]> {
    return this.httpClient.get<CategoriaEquipamento[]>(this.BASE_URL, this.httpOptions).pipe(
        map((resp: HttpResponse<CategoriaEquipamento[]>) => resp.status == 200 ? resp.body ?? [] : []),
        catchError((e) => throwError(() => e))
    );
    }

    buscarPorId(id: number): Observable<CategoriaEquipamento | null> {
        return this.httpClient.get<CategoriaEquipamento>(this.BASE_URL + "/" + id, this.httpOptions).pipe(
            map((resp: HttpResponse<CategoriaEquipamento>) => resp.status == 200 ? resp.body : null),
            catchError((e) => throwError(() => e))
        );
    }


    alterar(id: number, categoria: CategoriaEquipamento): Observable<CategoriaEquipamento | null> {
        return this.httpClient.put<CategoriaEquipamento>(this.BASE_URL + "/" + id, categoria, this.httpOptions).pipe(
            map((resp: HttpResponse<CategoriaEquipamento>) => resp.status == 200 ? resp.body : null),
            catchError((e) => throwError(() => e))
        );
    }

    remover(id: number): Observable<boolean> {
        return this.httpClient.delete<void>(this.BASE_URL + "/" + id, this.httpOptions).pipe(
            map((resp: HttpResponse<void>) => resp.status == 204),
            catchError((e) => throwError(() => e)) 
        );
    }
    
}