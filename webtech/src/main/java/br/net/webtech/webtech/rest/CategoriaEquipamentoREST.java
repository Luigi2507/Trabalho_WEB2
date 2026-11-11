package br.net.webtech.webtech.rest;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.service.CategoriaEquipamentoService;

@CrossOrigin
@RestController
public class CategoriaEquipamentoREST {

    private final CategoriaEquipamentoService categoriaService;

    public CategoriaEquipamentoREST(CategoriaEquipamentoService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // lista todas as categorias ativas
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaEquipamento>> listarAtivas() {
        return ResponseEntity.ok(categoriaService.listarAtivas());
    }

    // busca categ. por id
    @GetMapping("/categorias/{id}")
    public ResponseEntity<CategoriaEquipamento> buscarPorId(@PathVariable("id") Integer id) {
        return categoriaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // cadastrar uma categ. nova
    @PostMapping("/categorias")
    public ResponseEntity<Object> inserir(@RequestBody CategoriaEquipamento categoria) {
        if (nomeInvalido(categoria)) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Nome inválido."));
        }
        try {
            CategoriaEquipamento criada = categoriaService.inserir(categoria);
            return ResponseEntity.created(URI.create("/categorias/" + criada.getId())).body(criada);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensagem", "Já existe uma categoria com esse nome."));
        }
    }

    // alterar uma existente pelo id
    @PutMapping("/categorias/{id}")
    public ResponseEntity<Object> alterar(@PathVariable("id") Integer id,
            @RequestBody CategoriaEquipamento categoria) {
        if (nomeInvalido(categoria)) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", "Nome inválido."));
        }
        try {
            Optional<CategoriaEquipamento> alterada = categoriaService.alterar(categoria, id);
            if (alterada.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(alterada.get());
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensagem", "Já existe uma categoria com esse nome."));
        }
    }

    // solicita a remocao pelo id
    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> remover(@PathVariable("id") Integer id) {
        return categoriaService.remover(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    private boolean nomeInvalido(CategoriaEquipamento c) {
        return c == null || c.getNome() == null || c.getNome().trim().length() < 2
                || c.getNome().trim().length() > 50;
    }
}