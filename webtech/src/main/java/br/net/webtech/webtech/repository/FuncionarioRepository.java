package br.net.webtech.webtech.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import br.net.webtech.webtech.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    List<Funcionario> findByUsuarioAtivoTrueOrderByIdAsc(); // busca os usua. ativos e organiza os id em ordem crescente
    Optional<Funcionario> findByIdAndUsuarioAtivoTrue(Integer id); // busca por id
    long countByUsuarioAtivoTrue(); //conta qts func. possue o usu ativo
}