package br.net.webtech.webtech.model;

public class UsuarioDTO {
    private Integer id;
    private String nome;
    private String login;
    private String perfil;
    private String cpf;
 
    public UsuarioDTO() {
    }
 
    public UsuarioDTO(Integer id, String nome, String login, String perfil, String cpf) {
        this.id = id;
        this.nome = nome;
        this.login = login;
        this.perfil = perfil;
        this.cpf = cpf;
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
 
    public String getLogin() {
        return login;
    }
 
    public void setLogin(String login) {
        this.login = login;
    }
 
    public String getPerfil() {
        return perfil;
    }
 
    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }  

    public String getCpf() {
        return cpf;
    }
 
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}
