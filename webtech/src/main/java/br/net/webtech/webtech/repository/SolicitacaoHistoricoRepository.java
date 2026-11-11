package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.SolicitacaoHistorico;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoHistoricoRepository extends JpaRepository<SolicitacaoHistorico, Long> {
    List<SolicitacaoHistorico> findBySolicitacaoIdOrderByDataHoraAscIdAsc(Integer solicitacaoId);
}