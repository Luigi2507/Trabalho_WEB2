import { Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CategoriaEquipamento } from '../shared/models/categoria-equipamento.model';

const CHAVE = 'categoriasEquipamento';

@Injectable({ providedIn: 'root' })
export class CategoriaEquipamentoService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    listarTodos(): CategoriaEquipamento[] {
        if (!this.isBrowser) return [];

        const dados = localStorage.getItem(CHAVE);
        return dados ? JSON.parse(dados) : [];
    }

    buscarPorId(id: number): CategoriaEquipamento | undefined {
        return this.listarTodos().find(c => c.id === id);
    }

    inserir(categoria: CategoriaEquipamento): void {
        if (!this.isBrowser) return;
        if (!categoria.nome || categoria.nome.trim() === '') {
            throw new Error('O nome da categoria é obrigatório.');
        }
        const lista = this.listarTodos();
        categoria.id = Date.now();
        lista.push(categoria);
        localStorage.setItem(CHAVE, JSON.stringify(lista));
    }

    alterar(categoria: CategoriaEquipamento): void {
        if (!this.isBrowser) return;
        if (!categoria.nome || categoria.nome.trim() === '') {
            throw new Error('O nome da categoria é obrigatório.');
        }
        const lista = this.listarTodos();
        const index = lista.findIndex(c => c.id === categoria.id);
        if (index !== -1) {
            lista[index] = categoria;
            localStorage.setItem(CHAVE, JSON.stringify(lista));
        }
    }

    remover(id: number): void {
        if (!this.isBrowser) return;
        const lista = this.listarTodos().filter(c => c.id !== id);
        localStorage.setItem(CHAVE, JSON.stringify(lista));
    }
}
