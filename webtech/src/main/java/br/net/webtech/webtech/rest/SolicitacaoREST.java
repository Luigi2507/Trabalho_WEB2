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

    //Lista solicitação do cliente 
    @GetMapping("/clientes/{clienteId}/solicitacoes")
    public ResponseEntity<Object> listarPorCliente(@PathVariable("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.listarPorCliente(clienteId), HttpStatus.OK);
    }

    //Busca a solicitaçãoo específica levando em conta o cliente 
    @GetMapping("/solicitacoes/{id}")
    public ResponseEntity<Object> obterPorId(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.obterPorId(id, clienteId), HttpStatus.OK);
    }

    //Cria uma solicitação
    @PostMapping("/solicitacoes")
    public ResponseEntity<Object> inserir(@Valid @RequestBody SolicitacaoNovaDTO dto) {
        return executar(() -> solicitacaoService.criar(dto), HttpStatus.CREATED);
    }

    //Aprovação do orçamento
    @PutMapping("/solicitacoes/{id}/aprovar")
    public ResponseEntity<Object> aprovar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.aprovar(id, clienteId), HttpStatus.OK);
    }

    //Rejeição do orçamento
    @PutMapping("/solicitacoes/{id}/rejeitar")
    public ResponseEntity<Object> rejeitar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId ,@Valid @RequestBody RejeicaoDTO dto) {
        return executar(() -> solicitacaoService.rejeitar(id, clienteId, dto.motivo()), HttpStatus.OK);
    }

    //Resgate de uma solicitação
    @PutMapping("/solicitacoes/{id}/resgatar")
    public ResponseEntity<Object> resgatar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId) {
        return executar(() -> solicitacaoService.resgatar(id, clienteId), HttpStatus.OK);
    }

     //Registro do pagamento
    @PutMapping("/solicitacoes/{id}/pagar")
    public ResponseEntity<Object> pagar(@PathVariable("id") Integer id, @RequestParam("clienteId") Integer clienteId ) {
        return executar(() -> solicitacaoService.pagar(id, clienteId), HttpStatus.OK);
    }

    //Lista das solicitações, filtrando por status e funcionário
    @GetMapping("/solicitacoes")
    public ResponseEntity<Object> listar(@RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "funcionarioId", required = false) Integer funcionarioId) {
        return executar(() -> solicitacaoService.listar(status, funcionarioId), HttpStatus.OK);
    }
    
    //Busca uma solicitação pro funcionário
    @GetMapping("/funcionario/solicitacoes/{id}")
    public ResponseEntity<Object> obterParaFuncionario(@PathVariable("id") Integer id) {
        return executar(() -> solicitacaoService.obterParaFuncionario(id), HttpStatus.OK);
    }

    //Registro do valor de orçamento
    @PutMapping("/solicitacoes/{id}/orcamento")
    public ResponseEntity<Object> orcar(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId, @Valid @RequestBody OrcamentoDTO dto) {
        return executar(() -> solicitacaoService.orcar(id, funcionarioId, dto.valor()), HttpStatus.OK);
    }

    //Processo de manutenção
    @PutMapping("/solicitacoes/{id}/manutencao")
    public ResponseEntity<Object> manutencao(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId, @Valid @RequestBody ManutencaoDTO dto) {
        return executar(() -> solicitacaoService.efetuarManutencao(id, funcionarioId, dto.descricao(), dto.orientacoes()),
                HttpStatus.OK);
    }

    //Redirecionamento da solicitação
    @PutMapping("/solicitacoes/{id}/redirecionar")
    public ResponseEntity<Object> redirecionar(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId, @Valid @RequestBody RedirecionamentoDTO dto) {
        return executar(() -> solicitacaoService.redirecionar(id, funcionarioId, dto.destinoId()), HttpStatus.OK);
    }

    //Finalização de uma solicitação
    @PutMapping("/solicitacoes/{id}/finalizar")
    public ResponseEntity<Object> finalizar(@PathVariable("id") Integer id,
            @RequestParam("funcionarioId") Integer funcionarioId) {
        return executar(() -> solicitacaoService.finalizar(id, funcionarioId), HttpStatus.OK);
    }

    //Executa e retorna status
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