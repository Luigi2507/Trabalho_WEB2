package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.SolicitacaoHistorico;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoHistoricoRepository extends JpaRepository<SolicitacaoHistorico, Long> {
    // Busca os registros de hist. e organiza os result. p/ data e hora em ordem crescente
    List<SolicitacaoHistorico> findBySolicitacaoIdOrderByDataHoraAscIdAsc(Integer solicitacaoId);
}