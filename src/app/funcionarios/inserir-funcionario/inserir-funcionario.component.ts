import { Component, inject, ViewChild } from '@angular/core';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-inserir-funcionario',
  imports: [FormsModule, RouterModule],
  templateUrl: './inserir-funcionario.component.html',
  styleUrl: './inserir-funcionario.component.css',
})
export class InserirFuncionarioComponent {
  @ViewChild('formFuncionario') formulario! : NgForm;
  funcionario: Funcionario = new Funcionario();

  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);

  inserir(): void {
    if (this.formulario.valid) {

      const senha = this.gerarSenha();
      this.funcionario.senha = senha;
      
      this.funcionarioService.inserir(this.funcionario);
      this.router.navigate(["/funcionarios/listar"]);
    }
  }

  private gerarSenha(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
