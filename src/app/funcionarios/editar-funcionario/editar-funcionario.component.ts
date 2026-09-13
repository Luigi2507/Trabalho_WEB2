import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  funcionario: Funcionario = new Funcionario();

  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mensagemErro: string = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    const funcionarioEncontrado = this.funcionarioService.buscarPorID(id); //PROCURA O FUNCIONARIO

    if (funcionarioEncontrado) {
      this.funcionario = funcionarioEncontrado;
    } else {
      this.mensagemErro = 'Funcionário não encontrado.';
    }
  }    

  //ATUALIZAR CADASTRO
  editar(): void {
    if (this.formulario.valid) {
      this.funcionarioService.atualizar(this.funcionario);
      this.router.navigate(['/funcionarios/listar'])
    }
  }
}
