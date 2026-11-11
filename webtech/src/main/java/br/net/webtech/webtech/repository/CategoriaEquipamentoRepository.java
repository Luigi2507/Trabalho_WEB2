package br.net.webtech.webtech.repository;

import br.net.webtech.webtech.model.CategoriaEquipamento;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;


// responsavel pelas consultas e operações com categorias
public interface CategoriaEquipamentoRepository extends JpaRepository<CategoriaEquipamento, Integer> {
    List<CategoriaEquipamento> findByAtivoTrueOrderByNome();  // busca as categorias que estao ativas e organizando em ordem alfabetica
    Optional<CategoriaEquipamento> findByIdAndAtivoTrue(Integer id);  // busca pelo id
    Optional<CategoriaEquipamento> findByNome(String nome); // busca pelo nome.
}