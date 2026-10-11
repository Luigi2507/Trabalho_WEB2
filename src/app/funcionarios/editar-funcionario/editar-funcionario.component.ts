import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';

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
    if (this.formulario.valid) {
      this.funcionarioService.atualizar(this.funcionario()).subscribe({
        complete: () => this.router.navigate(['/funcionarios/listar'])
      });
    }
  }

  sair($event: any): void {
    $event.preventDefault();
    sessionStorage.removeItem('funcionarioLogado');
    this.router.navigate(['/login'])
  }
}
