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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.net.webtech.webtech.model.FuncionarioCadastroDTO;
import br.net.webtech.webtech.model.FuncionarioCriadoDTO;
import br.net.webtech.webtech.model.FuncionarioRespostaDTO;
import br.net.webtech.webtech.service.CadastroConflitoException;
import br.net.webtech.webtech.service.FuncionarioService;
import br.net.webtech.webtech.service.RegraNegocioException;
import jakarta.validation.Valid;

@CrossOrigin
@RestController
public class FuncionarioREST {

    private final FuncionarioService funcionarioService;

    public FuncionarioREST(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @GetMapping("/funcionarios")
    public ResponseEntity<List<FuncionarioRespostaDTO>> listar() {
        return ResponseEntity.ok(funcionarioService.listar());
    }

    @GetMapping("/funcionarios/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable("id") Integer id) {
        Optional<FuncionarioRespostaDTO> encontrado = funcionarioService.buscarPorId(id);
        if (encontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(encontrado.get());
    }

    @PostMapping("/funcionarios")
    public ResponseEntity<Object> inserir(@Valid @RequestBody FuncionarioCadastroDTO dto) {
        try {
            FuncionarioCriadoDTO criado = funcionarioService.inserir(dto);
            return ResponseEntity.created(URI.create("/funcionarios/" + criado.id())).body(criado);
        } catch (CadastroConflitoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("campo", e.getCampo()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("campo", "email"));
        }
    }
 
    @PutMapping("/funcionarios/{id}")
    public ResponseEntity<Object> alterar(@PathVariable("id") Integer id,
            @Valid @RequestBody FuncionarioCadastroDTO dto) {
        try {
            Optional<FuncionarioRespostaDTO> alterado = funcionarioService.alterar(id, dto);
            if (alterado.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(alterado.get());
        } catch (CadastroConflitoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("campo", e.getCampo()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("campo", "email"));
        }
    }

    @DeleteMapping("/funcionarios/{id}")
    public ResponseEntity<Object> remover(@PathVariable("id") Integer id,
            @RequestParam("idLogado") Integer idLogado) {
        try {
            if (funcionarioService.remover(id, idLogado)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (RegraNegocioException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensagem", e.getMessage()));
        }
    }
}
