package br.net.webtech.webtech.rest;

import java.util.Map;
import java.util.function.Supplier;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import br.net.webtech.webtech.model.RejeicaoDTO;
import br.net.webtech.webtech.model.SolicitacaoNovaDTO;
import br.net.webtech.webtech.service.EstadoInvalidoException;
import br.net.webtech.webtech.service.RecursoNaoEncontradoException;
import br.net.webtech.webtech.service.SolicitacaoService;
import jakarta.validation.Valid;

@CrossOrigin
@RestController
public class SolicitacaoREST {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoREST(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    /** RF003 - 200 OK | 404 cliente não existe */
    @GetMapping("/clientes/{clienteId}/solicitacoes")
    public ResponseEntity<Object> listarPorCliente(@PathVariable("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.listarPorCliente(clienteId), HttpStatus.OK);
    }

    /** RF005 / RF008 / RF010 - 200 OK | 404 NOT FOUND */
    @GetMapping("/solicitacoes/{id}")
    public ResponseEntity<Object> obterPorId(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.obterPorId(id, clienteId), HttpStatus.OK);
    }

    /** RF004 - 201 CREATED | 400 dados inválidos | 404 cliente ou categoria não existem */
    @PostMapping("/solicitacoes")
    public ResponseEntity<Object> inserir(@Valid @RequestBody SolicitacaoNovaDTO dto) {
        return executar(() -> solicitacaoService.criar(dto), HttpStatus.CREATED);
    }

    /** RF006 - 200 OK | 404 NOT FOUND | 409 não está ORCADA */
    @PutMapping("/solicitacoes/{id}/aprovar")
    public ResponseEntity<Object> aprovar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.aprovar(id, clienteId), HttpStatus.OK);
    }

    /** RF007 - 200 OK | 400 sem motivo | 404 NOT FOUND | 409 não está ORCADA */
    @PutMapping("/solicitacoes/{id}/rejeitar")
    public ResponseEntity<Object> rejeitar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId ,@Valid @RequestBody RejeicaoDTO dto) {
        return executar(() -> solicitacaoService.rejeitar(id, clienteId, dto.motivo()), HttpStatus.OK);
    }

    /** RF009 - 200 OK | 404 NOT FOUND | 409 não está REJEITADA */
    @PutMapping("/solicitacoes/{id}/resgatar")
    public ResponseEntity<Object> resgatar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.resgatar(id, clienteId), HttpStatus.OK);
    }

    /** RF010 - 200 OK | 404 NOT FOUND | 409 não está ARRUMADA */
    @PutMapping("/solicitacoes/{id}/pagar")
    public ResponseEntity<Object> pagar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId ) {
        return executar(() -> solicitacaoService.pagar(id, clienteId), HttpStatus.OK);
    }

    /** RF011 / RF013 - 200 OK */
    @GetMapping("/solicitacoes")
    public ResponseEntity<Object> listar(@RequestParam(name = "status", required = false) String status) {
        return executar(() -> solicitacaoService.listar(status), HttpStatus.OK);
    }

    @GetMapping("/funcionario/solicitacoes/{id}")
    public ResponseEntity<Object> obterParaFuncionario(@PathVariable("id") Integer id) {
        return executar(() -> solicitacaoService.obterParaFuncionario(id), HttpStatus.OK);
    }

    /** Roda a ação e converte as exceções do service em status code (404 / 409). */
    private ResponseEntity<Object> executar(Supplier<?> acao, HttpStatus sucesso) {
        try {
            return ResponseEntity.status(sucesso).body(acao.get());
        } catch (RecursoNaoEncontradoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", e.getMessage()));
        } catch (EstadoInvalidoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensagem", e.getMessage()));
        }
    }
    
}