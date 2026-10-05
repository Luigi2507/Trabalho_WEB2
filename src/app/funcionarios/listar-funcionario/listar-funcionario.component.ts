import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Funcionario } from '../../shared/models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFuncionarioComponent } from '../modal-funcionario/modal-funcionario.component';
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

  funcionarios: Funcionario[] = [];
  funcionarioLogado: any = null;

  //CARREGAR SESSAO
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.funcionarioLogado = this.loginService.usuarioLogado ?? {};
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
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalFuncionario(funcionario: Funcionario) {
    const modalRef = this.modalService.open(ModalFuncionarioComponent);
    modalRef.componentInstance.funcionario = funcionario;
  }
}