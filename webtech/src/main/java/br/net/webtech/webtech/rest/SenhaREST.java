package br.net.webtech.webtech.rest;
 
import java.util.Map;
 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
 
import br.net.webtech.webtech.model.RedefinirSenhaDTO;
import br.net.webtech.webtech.service.RecuperacaoSenhaService;
import jakarta.validation.Valid;
 
@CrossOrigin
@RestController
public class SenhaREST {
 
    private final RecuperacaoSenhaService recuperacaoSenhaService;
 
    public SenhaREST(RecuperacaoSenhaService recuperacaoSenhaService) {
        this.recuperacaoSenhaService = recuperacaoSenhaService;
    }
 
    @PostMapping("/senha/redefinir")
    public ResponseEntity<Object> redefinir(@Valid @RequestBody RedefinirSenhaDTO dto) {
        try {
            if (recuperacaoSenhaService.redefinir(dto.email())) {
                return ResponseEntity.ok(Map.of("mensagem", "Nova senha enviada por e-mail."));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensagem", "Não foi possível enviar a senha. Tente novamente."));
        }
    }
}
 