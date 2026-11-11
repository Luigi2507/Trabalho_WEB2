package br.net.webtech.webtech.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cliente") // o nome da tabela no bd

public class Cliente {
    @Id
    @Column(name = "usuario_id") // atributo esta relacionado com coluna usuario_id 
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER, optional = false) // define um relacionamento de 1/p/1 com usu., EAGER faz com que o usu. seja carregado junto com o cliet / opt é obgt
    @MapsId
    @JoinColumn(name = "usuario_id") // define a coluna utl para realizar o relac
    private Usuario usuario;

    @Column(name = "cpf", nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "telefone", nullable = false, length = 15)
    private String telefone;

    // define um relacionamento de um para um com Eend
    @OneToOne(fetch = FetchType.EAGER, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id", nullable = false)
    private Endereco endereco;

    public Cliente() {}

    public Integer getId() { 
        return id; 
    }
    public void setId(Integer id) { 
        this.id = id; 
    }

    public Usuario getUsuario() { 
        return usuario; 
    }
    public void setUsuario(Usuario usuario) { 
        this.usuario = usuario; 
    }

    public String getCpf() { 
        return cpf; 
    }
    public void setCpf(String cpf) { 
        this.cpf = cpf; 
    }

    public String getTelefone() { 
        return telefone; 
    }
    public void setTelefone(String telefone) { 
        this.telefone = telefone; 
    }

    public Endereco getEndereco() { 
        return endereco; 
    }
    public void setEndereco(Endereco endereco) { 
        this.endereco = endereco; 
    }
}