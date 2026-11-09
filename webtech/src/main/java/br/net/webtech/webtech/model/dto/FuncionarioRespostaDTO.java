package br.net.webtech.webtech.model.dto;

import java.time.LocalDate;

public record FuncionarioRespostaDTO(Integer id, String nome, String email, LocalDate dataNascimento) {
    
}
