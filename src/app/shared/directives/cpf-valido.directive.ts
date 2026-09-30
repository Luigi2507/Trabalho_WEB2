import { Directive, forwardRef } from '@angular/core';
// AbstractControl: representa o campo do formulário
// NG_VALIDATORS: "lista" de validadores do Angular; a gente se registra nela
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[cpfValido]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CpfValidoDirective),
    multi: true
  }]
})
export class CpfValidoDirective implements Validator {

// Método obrigatório da interface Validator.
  validate(control: AbstractControl): ValidationErrors | null {
    const cpf = String(control.value ?? '').replace(/\D/g, '');

    if (!cpf) return null;
    // Se o CPF for válido, retorna null 
    return this.cpfValido(cpf) ? null : { cpfInvalido: true };
  }

  // Faz a validação do CPF em si (recebe só os dígitos)
  private cpfValido(cpf: string): boolean {
    // um dígito seguido dele mesmo 10 vezes.
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    // Função que calcula um dígito verificador.
    const calcularDigito = (base: number): number => {
      let soma = 0;
      // Multiplica cada dígito por um peso decrescente
      for (let i = 0; i < base; i++) {
        soma += Number(cpf[i]) * (base + 1 - i);
      }
      //multiplica a soma por 10 e pega o resto da divisão por 11.
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };
    // O CPF é válido se os dígitos calculados baterem com os dois últimos
    return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10]);
  }
}