package br.net.webtech.webtech.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.Perfil;

public interface PerfilRepository extends JpaRepository<Perfil, Integer> {

    Optional<Perfil> findByCodigo(String codigo);
}