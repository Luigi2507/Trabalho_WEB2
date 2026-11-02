package br.net.webtech.webtech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.SolicitacaoHistorico;

public interface SolicitacaoHistoricoRepository extends JpaRepository<SolicitacaoHistorico, Long> {

    List<SolicitacaoHistorico> findBySolicitacaoIdOrderByDataHoraAscIdAsc(Integer solicitacaoId);
}