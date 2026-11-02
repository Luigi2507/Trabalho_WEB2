package br.net.webtech.webtech.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.StatusSolicitacao;

public interface StatusSolicitacaoRepository extends JpaRepository<StatusSolicitacao, Integer> {

    Optional<StatusSolicitacao> findByCodigo(String codigo);
}