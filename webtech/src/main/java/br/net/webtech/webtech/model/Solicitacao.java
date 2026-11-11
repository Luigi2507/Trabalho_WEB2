package br.net.webtech.webtech.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categoria_equipamento_id", nullable = false)
    private CategoriaEquipamento categoria;

    @Column(name = "descricao_equipamento", nullable = false, length = 200)
    private String descricaoEquipamento;

    @Column(name = "descricao_defeito", nullable = false, length = 1000)
    private String descricaoDefeito;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    private StatusSolicitacao status;

    @Column(name = "data_hora_abertura", nullable = false)
    private LocalDateTime dataHoraAbertura;

    @Column(name = "valor_orcamento", precision = 10, scale = 2)
    private BigDecimal valorOrcamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orcamento_funcionario_id")
    private Funcionario orcamentoFuncionario;

    @Column(name = "data_hora_orcamento")
    private LocalDateTime dataHoraOrcamento;

    @Column(name = "motivo_rejeicao", length = 500)
    private String motivoRejeicao;

    @Column(name = "descricao_manutencao", length = 1000)
    private String descricaoManutencao;

    @Column(name = "orientacoes_cliente", length = 1000)
    private String orientacoesCliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manutencao_funcionario_id")
    private Funcionario manutencaoFuncionario;

    @Column(name = "data_hora_manutencao")
    private LocalDateTime dataHoraManutencao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_atual_id")
    private Funcionario funcionarioAtual;

    @Column(name = "data_hora_pagamento")
    private LocalDateTime dataHoraPagamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finalizacao_funcionario_id")
    private Funcionario finalizacaoFuncionario;

    @Column(name = "data_hora_finalizacao")
    private LocalDateTime dataHoraFinalizacao;

    public Solicitacao() {}

    public Integer getId() { 
        return id; 
    }
    public void setId(Integer id) { 
        this.id = id; 
    }

    public Cliente getCliente() { 
        return cliente; 
    }
    public void setCliente(Cliente cliente) { 
        this.cliente = cliente; 
    }

    public CategoriaEquipamento getCategoria() { 
        return categoria; 
    }
    public void setCategoria(CategoriaEquipamento categoria) { 
        this.categoria = categoria; 
    }

    public String getDescricaoEquipamento() { 
        return descricaoEquipamento; 
    }
    public void setDescricaoEquipamento(String descricaoEquipamento) { 
        this.descricaoEquipamento = descricaoEquipamento; 
    }

    public String getDescricaoDefeito() { 
        return descricaoDefeito;
    }
    public void setDescricaoDefeito(String descricaoDefeito) { 
        this.descricaoDefeito = descricaoDefeito; 
    }

    public StatusSolicitacao getStatus() { 
        return status; 
    }
    public void setStatus(StatusSolicitacao status) { 
        this.status = status; 
    }

    public LocalDateTime getDataHoraAbertura() { 
        return dataHoraAbertura; 
    }
    public void setDataHoraAbertura(LocalDateTime dataHoraAbertura) { 
        this.dataHoraAbertura = dataHoraAbertura; 
    }

    public BigDecimal getValorOrcamento() { 
        return valorOrcamento; 
    }
    public void setValorOrcamento(BigDecimal valorOrcamento) { 
        this.valorOrcamento = valorOrcamento; 
    }

    public Funcionario getOrcamentoFuncionario() { 
        return orcamentoFuncionario; 
    }
    public void setOrcamentoFuncionario(Funcionario orcamentoFuncionario) { 
        this.orcamentoFuncionario = orcamentoFuncionario; 
    }

    public LocalDateTime getDataHoraOrcamento() { 
        return dataHoraOrcamento; 
    }
    public void setDataHoraOrcamento(LocalDateTime dataHoraOrcamento) { 
        this.dataHoraOrcamento = dataHoraOrcamento; 
    }

    public String getMotivoRejeicao() { 
        return motivoRejeicao; 
    }
    public void setMotivoRejeicao(String motivoRejeicao) { 
        this.motivoRejeicao = motivoRejeicao; 
    }

    public String getDescricaoManutencao() { 
        return descricaoManutencao; 
    }
    public void setDescricaoManutencao(String descricaoManutencao) { 
        this.descricaoManutencao = descricaoManutencao; 
    }

    public String getOrientacoesCliente() { 
        return orientacoesCliente; 
    }
    public void setOrientacoesCliente(String orientacoesCliente) { 
        this.orientacoesCliente = orientacoesCliente; 
    }

    public Funcionario getManutencaoFuncionario() { 
        return manutencaoFuncionario; 
    }
    public void setManutencaoFuncionario(Funcionario manutencaoFuncionario) { 
        this.manutencaoFuncionario = manutencaoFuncionario; 
    }

    public LocalDateTime getDataHoraManutencao() { 
        return dataHoraManutencao; 
    }
    public void setDataHoraManutencao(LocalDateTime dataHoraManutencao) { 
        this.dataHoraManutencao = dataHoraManutencao; 
    }

    public Funcionario getFuncionarioAtual() { 
        return funcionarioAtual; 
    }
    public void setFuncionarioAtual(Funcionario funcionarioAtual) { 
        this.funcionarioAtual = funcionarioAtual; 
    }

    public LocalDateTime getDataHoraPagamento() { 
        return dataHoraPagamento;
    }
    public void setDataHoraPagamento(LocalDateTime dataHoraPagamento) { 
        this.dataHoraPagamento = dataHoraPagamento; 
    }

    public Funcionario getFinalizacaoFuncionario() { 
        return finalizacaoFuncionario; 
    }
    public void setFinalizacaoFuncionario(Funcionario finalizacaoFuncionario) { 
        this.finalizacaoFuncionario = finalizacaoFuncionario; 
    }

    public LocalDateTime getDataHoraFinalizacao() { 
        return dataHoraFinalizacao; 
    }
    public void setDataHoraFinalizacao(LocalDateTime dataHoraFinalizacao) { 
        this.dataHoraFinalizacao = dataHoraFinalizacao; 
    }
}