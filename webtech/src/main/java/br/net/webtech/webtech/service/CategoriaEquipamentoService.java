package br.net.webtech.webtech.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.repository.CategoriaEquipamentoRepository;

@Service 
public class CategoriaEquipamentoService {
    private final CategoriaEquipamentoRepository repository;

    public CategoriaEquipamentoService(CategoriaEquipamentoRepository repository){
        this.repository = repository;
    }

    // insere categ nova 
    public CategoriaEquipamento inserir(CategoriaEquipamento categoria){
        Optional<CategoriaEquipamento> existente = repository.findByNome(categoria.getNome()); // procura se já existe uma categoria com o msm nome
        if (existente.isPresent() && !Boolean.TRUE.equals(existente.get().getAtivo())) { // se encontrou uma categoria e ela está inativa
            CategoriaEquipamento c = existente.get();
            c.setAtivo(true); // // Reativa a categoria em vez de criar outra 
            return repository.save(c);
        }

        categoria.setId(null);
        categoria.setAtivo(true);
        return repository.save(categoria);
    }

    // retorna as categ ativas
    public List<CategoriaEquipamento> listarAtivas(){
        return repository.findByAtivoTrueOrderByNome();
    }

    // busca categ por id
    public Optional<CategoriaEquipamento> buscarPorId(Integer id){
        return repository.findById(id).filter(CategoriaEquipamento::getAtivo);
    }

    // alterar nome da catg
    public Optional<CategoriaEquipamento> alterar(CategoriaEquipamento categoria, Integer id){
        return repository.findById(id).filter(CategoriaEquipamento::getAtivo).map(existente -> {
            Optional<CategoriaEquipamento> outra = repository.findByNome(categoria.getNome());
            if (outra.isPresent() && !outra.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe essa categoria");
            }
            existente.setNome(categoria.getNome());
            return repository.save(existente);
        });
    }

    // remover cat (no caso desativar)
    public boolean remover(Integer id){
        return repository.findById(id).filter(c -> Boolean.TRUE.equals(c.getAtivo())).map(c -> {
            c.setAtivo(false);
            repository.save(c);
            return true;
        }).orElse(false);
    }
}
