import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-editar-funcionario',
  imports: [FormsModule, RouterModule],
  templateUrl: './editar-funcionario.component.html',
  styleUrl: './editar-funcionario.component.css',
})

export class EditarFuncionarioComponent implements OnInit {
  @ViewChild('formFuncionario') formulario! : NgForm;
  funcionario = signal(new Funcionario());

  private funcionarioService = inject(FuncionarioService);
  private loginService = inject(LoginService); 
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mensagemErro = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    this.funcionarioService.buscarPorID(id).subscribe({
      next: (data: Funcionario) => this.funcionario.set(data),
      error: () => this.mensagemErro.set('Funcionário não encontrado.')
    })
  }    

  //ATUALIZAR CADASTRO
  editar(): void {
    if (!this.formulario.valid || this.dataNascimentoInvalida()) return;
    if (this.formulario.valid) {
      this.funcionarioService.atualizar(this.funcionario()).subscribe({
        next: () => this.router.navigate(['/funcionarios/listar']),
        error: (e: HttpErrorResponse) => alert(this.mensagemDeErro(e))
      });
    }
  }

  private mensagemDeErro(e: HttpErrorResponse): string {
    if(e.status === 409) return 'Este e-mail já está cadastrado.';
    if(e.status === 400) return 'Verifique os dados informados.';
    if(e.status === 404) return 'Funcionário não encontrado.';
    if(e.status === 0) return 'Não foi possível conectar ao servidor.';
    return 'Não foi possível salvar as alterações.';
  }

  dataMaxima: string = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  })();

  dataNascimentoInvalida(): boolean {
    const d = this.funcionario().dataNascimento
    return !!d && d > this.dataMaxima;
  }

  sair($event: any): void {
    $event.preventDefault();
    this.loginService.logout();
    this.router.navigate(['/login'])
  }
}
