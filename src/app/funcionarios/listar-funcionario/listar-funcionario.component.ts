import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFuncionarioComponent } from '../modal-funcionario/modal-funcionario.component';
import { ModalRemoverFuncionarioComponent } from '../modal-remover-funcionario/modal-remover-funcionario.component';
import { CaixaAltaPipe } from '../../shared/pipes';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-listar-funcionario',
  imports: [RouterModule, CommonModule, FormsModule, CaixaAltaPipe],
  templateUrl: './listar-funcionario.component.html',
  styleUrl: './listar-funcionario.component.css',
})

export class ListarFuncionarioComponent implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private platformId = inject(PLATFORM_ID);
  private loginService = inject(LoginService);

  funcionarios = signal<Funcionario[]>([]);
  funcionarioLogado: any = null;

  //CARREGAR SESSAO
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.funcionarioLogado = this.loginService.usuarioLogado ?? {};
    this.carregar();
  }
  
  carregar(): void {
    this.funcionarioService.listarTodos().subscribe({
      next: (data : Funcionario[]) => this.funcionarios.set(data ?? [])
    });
  }

  editar(funcionario: Funcionario): void {
    this.router.navigate(['/funcionarios/editar', funcionario.id]);
  }

  async remover(funcionario: Funcionario): Promise<void> {
    let confirmar = await this.abrirModalRemoverFuncionario(funcionario);

    if(!confirmar) return;

    this.funcionarioService.remover(funcionario.id, this.funcionarioLogado.id).subscribe({
      next: erro => {
        if (erro) {
          alert(erro);
          return;
        }
        this.carregar();
      }
    });
  }


  sair($event: any): void {
    $event.preventDefault();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalFuncionario(funcionario: Funcionario) {
    const modalRef = this.modalService.open(ModalFuncionarioComponent);
    modalRef.componentInstance.funcionario = funcionario;
  }

  abrirModalRemoverFuncionario(funcionario: Funcionario) : Promise<boolean>{
    const modalRef = this.modalService.open(ModalRemoverFuncionarioComponent);
    modalRef.componentInstance.funcionario = funcionario;

    return modalRef.result.then(
      (resultado : boolean) => resultado,
      () => false
    );
  }
}