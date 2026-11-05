package br.net.webtech.webtech.model;

import jakarta.validation.constraints.NotNull;

public record RedirecionamentoDTO(@NotNull Integer destinoId) {
}