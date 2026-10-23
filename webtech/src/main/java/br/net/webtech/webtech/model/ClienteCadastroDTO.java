package br.net.webtech.webtech.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Dados que o Angular envia no cadastro */
public record ClienteCadastroDTO(
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Size(max = 100) @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") String email,
        @NotBlank @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}") String cpf,
        @NotBlank @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}") String telefone,
        @NotBlank @Pattern(regexp = "\\d{5}-\\d{3}") String cep,
        @NotBlank @Size(max = 150) String logradouro,
        @NotBlank @Size(max = 10) String numero,
        @Size(max = 100) String complemento,
        @NotBlank @Size(max = 100) String bairro,
        @NotBlank @Size(max = 100) String cidade,
        @NotBlank @Pattern(regexp = "[A-Za-z]{2}") String estado) {
}
