package br.net.webtech.webtech.service;

// lançada quando uma regra de negocio impede a operacao
public class RegraNegocioException extends RuntimeException {
    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
    
}
