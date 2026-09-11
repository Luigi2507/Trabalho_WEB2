import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-funcionario',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './listar-funcionario.component.html',
  styleUrl: './listar-funcionario.component.css',
})
export class ListarFuncionarioComponent implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);

  funcionarios: Funcionario[] = [];
  funcionarioLogado: any = null;

  ngOnInit(): void {
    this.funcionarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    this.carregar();
  }

  carregar(): void {
    this.funcionarios = this.funcionarioService.listarTodos();
  }

  editar(funcionario: Funcionario): void {
    this.router.navigate(['/funcionarios/editar', funcionario.id]);
  }

  remover(funcionario: Funcionario): void {
    if (!confirm(`Deseja remover o funcionário "${funcionario.nome}"?`)) return;
 
    const erro = this.funcionarioService.remover(funcionario.id, this.funcionarioLogado.id);
    if (erro) {
      alert(erro);
      return;
    }
 
    this.carregar();
  }

  sair($event: any): void {
    $event.preventDefault();
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}