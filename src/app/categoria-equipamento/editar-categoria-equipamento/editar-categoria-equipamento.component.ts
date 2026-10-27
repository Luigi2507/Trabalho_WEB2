import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm} from '@angular/forms';
import { CategoriaEquipamento } from '../../shared/models/categoria-equipamento.model';
import { CategoriaEquipamentoService } from '../../services/categoria-equipamento.service';

@Component({
  selector: 'app-editar-categoria-equipamento',
  imports: [FormsModule, RouterLink],
  templateUrl: './editar-categoria-equipamento.component.html',
  styleUrl: './editar-categoria-equipamento.component.css',
})

export class EditarCategoriaEquipamentoComponent implements OnInit {
  categoria = signal(new CategoriaEquipamento());
  mensagem = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaEquipamentoService: CategoriaEquipamentoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(!id){
      this.router.navigate(['/categorias/listar']);
      return;
    }

    this.categoriaEquipamentoService.buscarPorId(id).subscribe({
      next : (dados) => {
        if(dados)
          this.categoria.set(dados);
      },
      error: () => {
        alert('Categoria não encontrada.');
        this.router.navigate(['/categorias/listar']);
      }
    });
  }

  salvar(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const {id, nome} = this.categoria();
    if(id === undefined){
      this.mensagem.set('Categoria inválida.');
      return;
    }
    
    this.categoriaEquipamentoService.alterar(id, {nome}).subscribe({
      next: () => this.router.navigate(['/categorias/listar']),
      error: (e) => this.mensagem.set(e.status === 404 ? 'Categoria não encontrada' : 'Erro ao alterar categoria.')
    });
  }
}