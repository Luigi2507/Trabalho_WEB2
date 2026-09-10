import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Funcionario } from '../shared/models/funcionario.model';

const LS_CHAVE = "funcionarios";

@Injectable({
  providedIn: 'root'
})

export class FuncionarioService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  listarTodos(): Funcionario[] {
    if (!this.isBrowser) return [];
    const funcionarios = localStorage[LS_CHAVE];
    return funcionarios ? JSON.parse(funcionarios) : [];
  }

  inserir(funcionario: Funcionario): string | null {
    if (!this.isBrowser) return null;

    const funcionarios = this.listarTodos();

    const emailExiste = funcionarios.some(
      f => f.email.toLowerCase() === funcionario.email.toLowerCase()
    );
    if (emailExiste) {
      return 'Este e-mail já está cadastrado.';
    }

    funcionario.id = new Date().getTime();
    funcionarios.push(funcionario);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
    return null;
  }

  buscarPorID(id: number): Funcionario | undefined {
    return this.listarTodos().find(f => f.id === id);
  }

  atualizar(funcionario: Funcionario): void {
    if (!this.isBrowser) return;

    const funcionarios = this.listarTodos();
    funcionarios.forEach((obj, index, objs) => {
      if (funcionario.id === obj.id) {
        objs[index] = funcionario;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  remover(id: number, idLogado: number): string | null {
    if (!this.isBrowser) return null;

    const funcionarios = this.listarTodos();

    if (id === idLogado) {
      return 'Você não pode remover a si mesmo.';
    }

    if (funcionarios.length <= 1) {
      return 'Não é possível remover o único funcionário cadastrado.';
    }

    const novaLista = funcionarios.filter(f => f.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(novaLista);
    return null;
  }
}