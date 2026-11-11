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

import br.net.webtech.webtech.model.dto.ManutencaoDTO;
import br.net.webtech.webtech.model.dto.OrcamentoDTO;
import br.net.webtech.webtech.model.dto.RedirecionamentoDTO;
import br.net.webtech.webtech.model.dto.RejeicaoDTO;
import br.net.webtech.webtech.model.dto.SolicitacaoNovaDTO;
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

    // lista solicitacao do cliente 
    @GetMapping("/clientes/{clienteId}/solicitacoes")
    public ResponseEntity<Object> listarPorCliente(@PathVariable("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.listarPorCliente(clienteId), HttpStatus.OK);
    }

    // busca a solicitacao especifica levando em conta o cliente tbm
    @GetMapping("/solicitacoes/{id}")
    public ResponseEntity<Object> obterPorId(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.obterPorId(id, clienteId), HttpStatus.OK);
    }

    // cria uma solicitacao de manutencao
    @PostMapping("/solicitacoes")
    public ResponseEntity<Object> inserir(@Valid @RequestBody SolicitacaoNovaDTO dto) {
        return executar(() -> solicitacaoService.criar(dto), HttpStatus.CREATED);
    }

    // permite ao cliente aprovar o orçamento
    @PutMapping("/solicitacoes/{id}/aprovar")
    public ResponseEntity<Object> aprovar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.aprovar(id, clienteId), HttpStatus.OK);
    }

    // permite ao cliente rejeitar o orçamento informando o motivo
    @PutMapping("/solicitacoes/{id}/rejeitar")
    public ResponseEntity<Object> rejeitar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId ,@Valid @RequestBody RejeicaoDTO dto) {
        return executar(() -> solicitacaoService.rejeitar(id, clienteId, dto.motivo()), HttpStatus.OK);
    }

    // resgatar uma solicitação que foi rejeitada
    @PutMapping("/solicitacoes/{id}/resgatar")
    public ResponseEntity<Object> resgatar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.resgatar(id, clienteId), HttpStatus.OK);
    }

     // registra o pagamento de solicitação pelo cliente
    @PutMapping("/solicitacoes/{id}/pagar")
    public ResponseEntity<Object> pagar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId ) {
        return executar(() -> solicitacaoService.pagar(id, clienteId), HttpStatus.OK);
    }

    // lista solicitações, podendo filtrar por status e func.
    @GetMapping("/solicitacoes")
    public ResponseEntity<Object> listar(@RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "funcionarioId", required = false) Integer funcionarioId) {
        return executar(() -> solicitacaoService.listar(status, funcionarioId), HttpStatus.OK);
    }
    
    // Busca uma solicitação para visualização do func.
    @GetMapping("/funcionario/solicitacoes/{id}")
    public ResponseEntity<Object> obterParaFuncionario(@PathVariable("id") Integer id) {
        return executar(() -> solicitacaoService.obterParaFuncionario(id), HttpStatus.OK);
    }

    // Permite ao func. registrar o valor do orçamento
    @PutMapping("/solicitacoes/{id}/orcamento")
    public ResponseEntity<Object> orcar(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId, @Valid @RequestBody OrcamentoDTO dto) {
        return executar(() -> solicitacaoService.orcar(id, funcionarioId, dto.valor()), HttpStatus.OK);
    }

    // Registra a execução da manutenção pelo func. / recebe a descrição do serviço e as orientações
    @PutMapping("/solicitacoes/{id}/manutencao")
    public ResponseEntity<Object> manutencao(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId, @Valid @RequestBody ManutencaoDTO dto) {
        return executar(() -> solicitacaoService.efetuarManutencao(id, funcionarioId, dto.descricao(), dto.orientacoes()),
                HttpStatus.OK);
    }

    // permite que um func. redirecione a solicitação para outro
    @PutMapping("/solicitacoes/{id}/redirecionar")
    public ResponseEntity<Object> redirecionar(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId, @Valid @RequestBody RedirecionamentoDTO dto) {
        return executar(() -> solicitacaoService.redirecionar(id, funcionarioId, dto.destinoId()), HttpStatus.OK);
    }

    // finalizar uma solicitação 
    @PutMapping("/solicitacoes/{id}/finalizar")
    public ResponseEntity<Object> finalizar(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId) {
        return executar(() -> solicitacaoService.finalizar(id, funcionarioId), HttpStatus.OK);
    }

    /** Roda a ação e converte as exceções do service em status code (400 / 404 / 409). */
    private ResponseEntity<Object> executar(Supplier<?> acao, HttpStatus sucesso) {
        try {
            return ResponseEntity.status(sucesso).body(acao.get());
        } catch (RecursoNaoEncontradoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", e.getMessage()));
        } catch (EstadoInvalidoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensagem", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensagem", e.getMessage()));
        }
    }
    
}