package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.Perfil;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerfilRepository extends JpaRepository<Perfil, Integer> {
    Optional<Perfil> findByCodigo(String codigo);
}