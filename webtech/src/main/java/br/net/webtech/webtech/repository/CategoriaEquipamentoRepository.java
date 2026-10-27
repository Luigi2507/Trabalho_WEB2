package br.net.webtech.webtech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.net.webtech.webtech.model.CategoriaEquipamento;

public interface CategoriaEquipamentoRepository extends JpaRepository<CategoriaEquipamento, Integer>{
    List<CategoriaEquipamento> findByAtivoTrue();
}
