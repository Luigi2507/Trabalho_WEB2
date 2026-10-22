package br.net.webtech.webtech.rest;
 
import java.util.Optional;
 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
 
import br.net.webtech.webtech.model.Login;
import br.net.webtech.webtech.model.Usuario;
import br.net.webtech.webtech.model.UsuarioDTO;
import br.net.webtech.webtech.repository.UsuarioRepository;
import br.net.webtech.webtech.seguranca.senhaUtil;
 
@CrossOrigin
@RestController
public class LoginREST {
 
    private final UsuarioRepository usuarioRepository;
 
    public LoginREST(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
 
    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody Login login) {
        if (login.getLogin() == null || login.getSenha() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
 
        Optional<Usuario> encontrado = usuarioRepository.findByEmailAndAtivoTrue(login.getLogin().trim());
 
        if (encontrado.isPresent()) {
            Usuario usuario = encontrado.get();
            if (senhaUtil.confere(usuario.getSalt(), login.getSenha(), usuario.getSenhaHash())) {
                UsuarioDTO dto = new UsuarioDTO(usuario.getId(), usuario.getNome(),
                        usuario.getEmail(), usuario.getPerfil().getCodigo());
                return ResponseEntity.ok(dto);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
 