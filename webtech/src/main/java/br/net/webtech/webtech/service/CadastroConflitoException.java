package br.net.webtech.webtech.service;

public class CadastroConflitoException extends RuntimeException {
    private final String campo;

    public CadastroConflitoException(String campo) {
        super("Já cadastrado: " + campo);
        this.campo = campo;
    }

    public String getCampo() {
        return campo;
    }
}
