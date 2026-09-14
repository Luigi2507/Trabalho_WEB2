import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm} from '@angular/forms';
import { RouterLink, Router} from '@angular/router';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  selector: 'app-inserir-categoria-equipamento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inserir-categoria-equipamento.component.html',
  styleUrl: './inserir-categoria-equipamento.component.css',
})
export class InserirCategoriaEquipamentoComponent {

  categoria: CategoriaEquipamento = new CategoriaEquipamento();

  constructor(
    private categoriaEquipamentoService: CategoriaEquipamentoService, 
    private router: Router
  ) {}

  salvar(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.categoriaEquipamentoService.inserir(this.categoria);
    this.router.navigate(['/categorias/listar']);
  }
}
