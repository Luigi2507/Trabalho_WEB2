package br.net.webtech.webtech.model;

import java.time.LocalDate;

public record FuncionarioRespostaDTO(Integer id, String nome, String email, LocalDate dataNascimento) {
    
}
