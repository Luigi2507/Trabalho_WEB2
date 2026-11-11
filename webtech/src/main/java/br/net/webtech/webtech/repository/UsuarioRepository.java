package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.Usuario;
 
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmailAndAtivoTrue(String email);

    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Integer id);
}
 