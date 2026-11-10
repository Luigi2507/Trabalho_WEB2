package br.net.webtech.webtech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.net.webtech.webtech.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {

    List<Solicitacao> findByClienteIdOrderByDataHoraAbertura(Integer clienteId);
    List<Solicitacao> findAllByOrderByDataHoraAberturaAsc();
    List<Solicitacao> findByStatusCodigoOrderByDataHoraAberturaAsc(String codigo);

    long countByFuncionarioAtualIdAndStatusCodigo(Integer funcionarioId, String codigo);

    @Query("""
        select s from Solicitacao s
        left join s.funcionarioAtual f
        where s.status.codigo <> 'REDIRECIONADA' or f.id = :funcionarioId
        order by s.dataHoraAbertura ASC
        """)
    List<Solicitacao> findVisiveisParaFuncionario(@Param("funcionarioId") Integer funcionarioId);
}