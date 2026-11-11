package br.net.webtech.webtech.model.dto;

import java.time.LocalDate;
// retorna info do func.
public record FuncionarioRespostaDTO(Integer id, String nome, String email, LocalDate dataNascimento) {}