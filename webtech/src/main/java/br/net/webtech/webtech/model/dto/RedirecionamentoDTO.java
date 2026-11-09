package br.net.webtech.webtech.model.dto;

import jakarta.validation.constraints.NotNull;

public record RedirecionamentoDTO(@NotNull Integer destinoId) {
}