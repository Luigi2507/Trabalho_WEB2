package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.Solicitacao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
    List<Solicitacao> findByClienteIdOrderByDataHoraAbertura(Integer clienteId); //busca as solic do cliente organizado pela data de abertura
    List<Solicitacao> findAllByOrderByDataHoraAberturaAsc(); //busca as solic organizando pela data de abertura da + anriga pra + recente
    List<Solicitacao> findByStatusCodigoOrderByDataHoraAberturaAsc(String codigo); // busca as soli. pelo cod do status
    long countByFuncionarioAtualIdAndStatusCodigo(Integer funcionarioId, String codigo); // conta qts solic estão assoc a um hor. especifico

    // Consulta JPQL p/ buscar as solicitações visiveis para determinado func.
    @Query("""
        select s from Solicitacao s
        left join s.funcionarioAtual f
        where s.status.codigo <> 'REDIRECIONADA' or f.id = :funcionarioId
        order by s.dataHoraAbertura ASC
        """)
    List<Solicitacao> findVisiveisParaFuncionario(@Param("funcionarioId") Integer funcionarioId);
}