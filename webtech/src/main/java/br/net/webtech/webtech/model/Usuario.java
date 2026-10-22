package br.net.webtech.webtech.model;


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
@Table(name = "usuario")
public class Usuario {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;
 
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
 
    @Column(name = "senha_hash", nullable = false, length = 64)
    private String senhaHash;
 
    @Column(name = "salt", nullable = false, length = 32)
    private String salt;
 
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "perfil_id", nullable = false)
    private Perfil perfil;
 
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;
 
    public Usuario() {
    }
 
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
 
    public String getEmail() {
        return email;
    }
 
    public void setEmail(String email) {
        this.email = email;
    }
 
    public String getSenhaHash() {
        return senhaHash;
    }
 
    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
 
    public String getSalt() {
        return salt;
    }
 
    public void setSalt(String salt) {
        this.salt = salt;
    }
 
    public Perfil getPerfil() {
        return perfil;
    }
 
    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }
 
    public Boolean getAtivo() {
        return ativo;
    }
 
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
 