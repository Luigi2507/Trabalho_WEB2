package br.net.webtech.webtech.service;

public class EstadoInvalidoException extends RuntimeException {

    public EstadoInvalidoException(String mensagem) {
        super(mensagem);
    }
}