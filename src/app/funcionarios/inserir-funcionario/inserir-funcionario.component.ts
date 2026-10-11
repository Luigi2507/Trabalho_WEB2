import { Component, inject, ViewChild, signal } from '@angular/core';
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

  //Insere novo func
  inserir(): void {
    if (this.formulario.valid) {

      const senha = this.gerarSenha();
      this.funcionario.senha = senha;
      
      this.funcionarioService.inserir(this.funcionario).subscribe({
        next: erro => {
          if (erro) {
            alert(erro);
            return;
          }
          this.abrirModalSenhaGerada(senha);
        }
      });
    }
  }

  //gerar senha
  private gerarSenha(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  //Modal para exibir senha do funcionário
  public exibirModalSenhaGerada = signal(false);
  public senhaGerada: string = '';

  public abrirModalSenhaGerada(senha: string): void{
     this.senhaGerada = senha;
     this.exibirModalSenhaGerada.set(true);
  }

  public fecharModalSenhaGerada(): void{
    this.exibirModalSenhaGerada.set(false);
    this.senhaGerada = '';
    this.router.navigate(["/funcionarios/listar"]);
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('funcionarioLogado');
    this.router.navigate(['/login'])
  }
}
