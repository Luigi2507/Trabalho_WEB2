import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaEquipamento } from '../shared/models/categoria-equipamento.model';

const CHAVE = 'categoriasEquipamento';

@Injectable({ providedIn: 'root' })
export class CategoriaEquipamentoService {
    BASE_URL = "http://localhost:3000/categorias";
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    };
    private httpClient = inject(HttpClient);

    listarTodos(): Observable<CategoriaEquipamento[]> {
        return this.httpClient.get<CategoriaEquipamento[]>(this.BASE_URL, this.httpOptions);
    }

    buscarPorId(id: number): Observable<CategoriaEquipamento> {
        return this.httpClient.get<CategoriaEquipamento>(this.BASE_URL + "/" + id, this.httpOptions);
    }

    inserir(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento> {
        // o id é gerado pelo json-server
        const { id, ...dados } = categoria;
        return this.httpClient.post<CategoriaEquipamento>(this.BASE_URL, JSON.stringify(dados), this.httpOptions);
    }

    remover(id: number): Observable<CategoriaEquipamento> {
        return this.httpClient.delete<CategoriaEquipamento>(this.BASE_URL + "/" + id, this.httpOptions);
    }

    alterar(categoria: CategoriaEquipamento): Observable<CategoriaEquipamento> {
        return this.httpClient.put<CategoriaEquipamento>(this.BASE_URL + "/" + categoria.id,
        JSON.stringify(categoria), this.httpOptions);
    }
}