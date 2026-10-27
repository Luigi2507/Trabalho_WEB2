package br.net.webtech.webtech.service;
 
import java.util.Optional;
 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import br.net.webtech.webtech.model.Usuario;
import br.net.webtech.webtech.repository.UsuarioRepository;
import br.net.webtech.webtech.seguranca.senhaUtil;
 
@Service
public class RecuperacaoSenhaService {
 
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
 
    public RecuperacaoSenhaService(UsuarioRepository usuarioRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }
    @Transactional
    public boolean redefinir(String email) {
        Optional<Usuario> encontrado = usuarioRepository.findByEmailAndAtivoTrue(ClienteService.normalizarEmail(email));
        if (encontrado.isEmpty()) {
            return false;
        }
 
        Usuario usuario = encontrado.get();
        String senha = senhaUtil.gerarSenhaNumerica();
        String salt = senhaUtil.gerarSalt();
        usuario.setSalt(salt);
        usuario.setSenhaHash(senhaUtil.gerarHash(salt, senha));
        usuarioRepository.save(usuario);
 
        emailService.enviarNovaSenha(usuario.getEmail(), usuario.getNome(), senha);
        return true;
    }
}
 