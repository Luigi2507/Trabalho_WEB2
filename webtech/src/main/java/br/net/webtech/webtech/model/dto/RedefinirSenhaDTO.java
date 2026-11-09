package br.net.webtech.webtech.model.dto;
 
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
 

public record RedefinirSenhaDTO(@NotBlank @Email String email) {
}
 