package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.StatusSolicitacao;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusSolicitacaoRepository extends JpaRepository<StatusSolicitacao, Integer> {
    Optional<StatusSolicitacao> findByCodigo(String codigo);
}