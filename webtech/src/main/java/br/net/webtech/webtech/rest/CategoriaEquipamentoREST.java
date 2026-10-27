package br.net.webtech.webtech.rest;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.service.CategoriaEquipamentoService;
import jakarta.validation.Valid;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@CrossOrigin 
@RestController 
public class CategoriaEquipamentoREST {
    public List<CategoriaEquipamento> lista = new ArrayList<>();
    private final CategoriaEquipamentoService service;

   public CategoriaEquipamentoREST(CategoriaEquipamentoService service){
        this.service = service;
   }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaEquipamento> inserir(@Valid @RequestBody CategoriaEquipamento categoria){
        CategoriaEquipamento salva = service.inserir(categoria);
        return ResponseEntity.created(URI.create("/categorias/" + salva.getId())).body(salva);
    }
    
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaEquipamento>> listarAtivas() {
        return ResponseEntity.ok(service.listarAtivas());
    }

    @GetMapping("/categorias/{id}")
    public ResponseEntity<CategoriaEquipamento> buscarPorId(@PathVariable("id") int id) {
        return service.buscarPorId(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("categorias/{id}")
    public ResponseEntity<CategoriaEquipamento> alterara(@PathVariable("id") int id, @Valid @RequestBody CategoriaEquipamento categoria) {
        return service.alterar(categoria, id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> remover(@PathVariable("id") Integer id){
        return service.remover(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}
