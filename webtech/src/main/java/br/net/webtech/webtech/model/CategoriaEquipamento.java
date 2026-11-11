package br.net.webtech.webtech.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categoria_equipamento") // o nome da tabela no bd
public class CategoriaEquipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // // O bd vai gerar o ID automaticamente
    private Integer id;

    @Column(name = "nome", nullable = false, unique = true, length = 50)
    private String nome;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true; //nova categoria é ativa

    public CategoriaEquipamento() {}

    public Integer getId() { 
        return id;
    }
    public void setId(Integer id) { 
        this.id = id; 
    }

    public String getNome() { 
        return nome; 
    }
    public void setNome(String nome) { 
        this.nome = nome; 
    }

    public Boolean getAtivo() { 
        return ativo; 
    }
    public void setAtivo(Boolean ativo) { 
        this.ativo = ativo; 
    }
}