package br.net.webtech.webtech.service;

/** Lançada quando o e-mail ou o CPF já existem. "campo" diz qual dos dois. */
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
