package br.net.webtech.webtech.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.repository.CategoriaEquipamentoRepository;

/** Por enquanto só a listagem (usada no formulário de nova solicitação). O CRUD (RF017) vem depois. */
@CrossOrigin
@RestController
public class CategoriaEquipamentoREST {

    private final CategoriaEquipamentoRepository categoriaRepository;

    public CategoriaEquipamentoREST(CategoriaEquipamentoRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaEquipamento>> listarAtivas() {
        return ResponseEntity.ok(categoriaRepository.findByAtivoTrueOrderByNome());
    }
}