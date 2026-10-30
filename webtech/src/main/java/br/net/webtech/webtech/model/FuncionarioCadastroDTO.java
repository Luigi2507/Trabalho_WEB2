package br.net.webtech.webtech.model;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record FuncionarioCadastroDTO(
    @NotBlank @Size (max = 100) String nome,
    @NotBlank @Size (max = 100) @Pattern (regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") String email,
    @NotNull @Past LocalDate dataNascimento) {
}
