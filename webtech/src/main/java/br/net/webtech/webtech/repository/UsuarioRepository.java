package br.net.webtech.webtech.repository;
 
import java.util.Optional;
 
import org.springframework.data.jpa.repository.JpaRepository;
 
import br.net.webtech.webtech.model.Usuario;
 
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
 
    /** Usado no login: só encontra usuários ativos (remoção lógica). */
    Optional<Usuario> findByEmailAndAtivoTrue(String email);

    /** Usado no cadastro: vale para ativos e inativos (a coluna email é UNIQUE) */
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Integer id);
}
 