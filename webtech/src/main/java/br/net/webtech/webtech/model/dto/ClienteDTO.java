package br.net.webtech.webtech.model.dto;

import br.net.webtech.webtech.model.Cliente;
import br.net.webtech.webtech.model.Endereco;

public record ClienteDTO(
    Integer id,
    String nome,
    String cpf,
    String email,
    String telefone,
    String cep,
    String logradouro,
    String numero,
    String complemento,
    String bairro,
    String cidade,
    String estado) {
    
    public static ClienteDTO de(Cliente c) {
        Endereco e = c.getEndereco(); // Pega o endereço associado ao cliente.
        
        // Cria e retorna um novo dto preenchido
        return new ClienteDTO(
                c.getId(),
                c.getUsuario().getNome(),
                c.getCpf(),
                c.getUsuario().getEmail(),
                c.getTelefone(),
                e.getCep(),
                e.getLogradouro(),
                e.getNumero(),
                e.getComplemento(),
                e.getBairro(),
                e.getCidade(),
                e.getEstado());
    }
}
