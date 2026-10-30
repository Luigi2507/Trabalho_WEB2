import { Component, inject, ViewChild, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { LoginService } from '../../services/login.service';
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
  private loginService = inject(LoginService);
  private router = inject(Router);

  //Insere novo func
  inserir(): void {
    if (this.formulario.valid) {
      
      this.funcionarioService.inserir(this.funcionario).subscribe({
        next: (criado: Funcionario) => this.abrirModalSenhaGerada(criado.senha),
        error: (e: HttpErrorResponse) => alert(this.mensagemDeErro(e))
      });
    }
  }

  private mensagemDeErro (e: HttpErrorResponse): string {
    if(e.status === 409) return 'Este e-mail já está cadastrado.';
    if(e.status === 400) return 'Verifique os dados informados.';
    if(e.status === 0) return 'Não foi possível conectar ao servidor.';
    return 'Não foi possível concluir o cadastro.';
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
    this.loginService.logout();
    this.router.navigate(['/login'])
  }
}
