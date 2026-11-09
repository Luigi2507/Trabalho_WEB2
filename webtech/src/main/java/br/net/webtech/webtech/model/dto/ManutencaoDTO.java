package br.net.webtech.webtech.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ManutencaoDTO(
        @NotBlank @Size(max = 1000) String descricao,
        @NotBlank @Size(max = 1000) String orientacoes) {
}