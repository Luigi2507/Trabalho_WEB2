package br.net.webtech.webtech.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejeicaoDTO(@NotBlank @Size(max = 500) String motivo) {
}