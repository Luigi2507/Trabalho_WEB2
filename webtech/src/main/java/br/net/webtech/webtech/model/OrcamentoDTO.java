package br.net.webtech.webtech.model;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record OrcamentoDTO(@NotNull @DecimalMin("0.01") BigDecimal valor) {
}