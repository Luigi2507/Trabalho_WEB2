package br.net.webtech.webtech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
    List<Solicitacao> findByClienteIdOrderByDataHoraAbertura(Integer clienteId);
}