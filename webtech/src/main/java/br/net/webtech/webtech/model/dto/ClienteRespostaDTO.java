package br.net.webtech.webtech.model.dto;

/** O que o back devolve após cadastrar (nunca devolve senha, hash nem salt). */
public record ClienteRespostaDTO(Integer id, String nome, String email) {
}
