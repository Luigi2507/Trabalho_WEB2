package br.net.webtech.webtech.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SolicitacaoNovaDTO(
        @NotNull Integer clienteId,
        @NotNull Integer categoriaId,
        @NotBlank @Size(min = 2, max = 200) String descricaoEquipamento,
        @NotBlank @Size(min = 5, max = 1000) String descricaoDefeito) {
}