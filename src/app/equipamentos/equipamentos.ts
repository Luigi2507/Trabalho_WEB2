import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface CategoriaEquipamento{
    id: number;
    nome: string;
}

@Component({
  selector: 'app-equipamentos',
  imports: [CommonModule, FormsModule],
  templateUrl: './equipamentos.html',
  styleUrl: './equipamentos.css'
})

export class Equipamentos {
    public categorias: CategoriaEquipamento[] = [
        {id: 1, nome: 'Notebook'},
        {id: 2, nome: 'Desktop'},
        {id: 3, nome: 'Impressora'},
        {id: 4, nome: 'Mouse'},
        {id: 5, nome: 'Teclado'}
    ];
    
    public nomeCategoria: string = '';
    public erro: string = '';

    public salvarCategoria(): void{
        if (!this.nomeCategoria.trim()){
            this.erro = 'Insira um nome de categoria';
            return;
        }

        this.categorias.push({
            id: Date.now(),
            nome: this.nomeCategoria
        });

        this.nomeCategoria = '';
        this.erro = '';
    }

    public RemoverCategoria(id: number): void{
        if (confirm('Remover categoria?')){
            this.categorias = this.categorias.filter(c=> c.id !== id);
        }
    }

    public limpaErro(): void{
        this.erro = '';
    }
}