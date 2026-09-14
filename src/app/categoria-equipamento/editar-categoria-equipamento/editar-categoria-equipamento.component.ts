import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm} from '@angular/forms';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  selector: 'app-editar-categoria-equipamento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-categoria-equipamento.component.html',
  styleUrl: './editar-categoria-equipamento.component.css',
})
export class EditarCategoriaEquipamentoComponent implements OnInit {

  categoria: CategoriaEquipamento = new CategoriaEquipamento();

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private categoriaEquipamentoService: CategoriaEquipamentoService
) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.categoria = this.categoriaEquipamentoService.buscarPorId(id)!;
  } 

  salvar(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.categoriaEquipamentoService.alterar(this.categoria);
    this.router.navigate(['/categorias/listar']);
  }
}
