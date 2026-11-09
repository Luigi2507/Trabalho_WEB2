package br.net.webtech.webtech.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoDTO(
        Integer id,
        Integer clienteId,
        String clienteCpf,
        String clienteNome,
        String descricaoEquipamento,
        String categoria,
        String descricaoDefeito,
        LocalDateTime dataHora,
        String status,
        BigDecimal orcamento,
        String motivoRejeicao,
        LocalDateTime dataPagamento,
        List<HistoricoDTO> historico,
        String funcionarioOrcamento,
        String descricaoManutencao,
        String orientacoesCliente,
        String funcionarioManutencao,
        String funcionarioAtual,
        String funcionarioFinalizacao,
        LocalDateTime dataFinalizacao) {
}