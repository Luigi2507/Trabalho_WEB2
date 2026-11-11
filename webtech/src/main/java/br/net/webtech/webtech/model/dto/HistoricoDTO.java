package br.net.webtech.webtech.model.dto;

import java.time.LocalDateTime;

public record HistoricoDTO(LocalDateTime dataHora, String status, String funcionario) {}