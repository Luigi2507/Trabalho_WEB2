package br.net.webtech.webtech.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
 
/** Tabela de domínio "perfil": CLIENTE ou FUNCIONARIO. */
@Entity
@Table(name = "perfil")
public class Perfil {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    @Column(name = "codigo", nullable = false, unique = true, length = 20)
    private String codigo;
 
    public Perfil() {
    }
 
    public Integer getId() {
        return id;
    }
 
    public void setId(Integer id) {
        this.id = id;
    }
 
    public String getCodigo() {
        return codigo;
    }
 
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
}