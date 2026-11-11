package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.CategoriaEquipamento;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaEquipamentoRepository extends JpaRepository<CategoriaEquipamento, Integer> {
    List<CategoriaEquipamento> findByAtivoTrueOrderByNome();

    Optional<CategoriaEquipamento> findByIdAndAtivoTrue(Integer id);
}