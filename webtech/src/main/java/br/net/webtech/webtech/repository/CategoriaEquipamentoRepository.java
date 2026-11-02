package br.net.webtech.webtech.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.CategoriaEquipamento;

public interface CategoriaEquipamentoRepository extends JpaRepository<CategoriaEquipamento, Integer> {

    /** Só as categorias ativas (remoção lógica), em ordem alfabética. */
    List<CategoriaEquipamento> findByAtivoTrueOrderByNome();

    Optional<CategoriaEquipamento> findByIdAndAtivoTrue(Integer id);
}