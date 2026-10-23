package br.net.webtech.webtech.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    boolean existsByCpf(String cpf);
}