package br.net.webtech.webtech.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.repository.CategoriaEquipamentoRepository;

@Service 
public class CategoriaEquipamentoService {
    private final CategoriaEquipamentoRepository repository;

    public CategoriaEquipamentoService(CategoriaEquipamentoRepository repository){
        this.repository = repository;
    }

    public CategoriaEquipamento inserir(CategoriaEquipamento categoria){
        categoria.setId(null);
        categoria.setAtivo(true);
        return repository.save(categoria);
    }

    public List<CategoriaEquipamento> listarAtivas(){
        return repository.findByAtivoTrue();
    }

    public Optional<CategoriaEquipamento> buscarPorId(Integer id){
        return repository.findById(id).filter(CategoriaEquipamento::getAtivo);
    }

    public Optional<CategoriaEquipamento> alterar(CategoriaEquipamento categoria, Integer id){
        return repository.findById(id).filter(CategoriaEquipamento::getAtivo).map(existente ->{
            existente.setNome(categoria.getNome());
            return repository.save(existente);
        });
    }

    public boolean remover(Integer id){
        return repository.findById(id).filter(c -> Boolean.TRUE.equals(c.getAtivo())).map(c -> {
            c.setAtivo(false);
            repository.save(c);
            return true;
        }).orElse(false);
    }
}
