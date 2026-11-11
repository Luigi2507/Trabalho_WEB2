package br.net.webtech.webtech.rest;

import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.mail.MailException;

import br.net.webtech.webtech.model.dto.ClienteCadastroDTO;
import br.net.webtech.webtech.service.CadastroConflitoException;
import br.net.webtech.webtech.service.ClienteService;
import jakarta.validation.Valid;

@CrossOrigin
@RestController
public class ClienteREST {

    private final ClienteService clienteService;

    public ClienteREST(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // cadastro de cliente
    @PostMapping("/clientes")
    public ResponseEntity<Object> inserir(@Valid @RequestBody ClienteCadastroDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(dto));
        } catch (CadastroConflitoException e) { //201
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("campo", e.getCampo()));
        } catch (DataIntegrityViolationException e) { 
            // duas pessoas cadastrando o mesmo e-mail/CPF ao mesmo tempo 409
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("campo", "desconhecido"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensagem", e.getMessage())); //400
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensagem", "Não foi possível enviar a senha. Tente novamente.")); //500
        }
    }

    
    // Verifica se o CPF e o e-mail já estão cadastrados, Utilizado na primeira etapa do cadastro
    @GetMapping("/clientes/verificar")
    public ResponseEntity<Map<String, Boolean>> verificar(@RequestParam("cpf") String cpf,
            @RequestParam("email") String email) {
        return ResponseEntity.ok(Map.of(
                "emailCadastrado", clienteService.emailCadastrado(email),
                "cpfCadastrado", clienteService.cpfCadastrado(cpf)));
    }
}
