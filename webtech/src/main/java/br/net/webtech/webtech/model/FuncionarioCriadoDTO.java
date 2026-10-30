package br.net.webtech.webtech.model;

import java.time.LocalDate;

public record FuncionarioCriadoDTO(Integer id, String nome, String email, LocalDate dataNascimento, String senha) {
    
}
