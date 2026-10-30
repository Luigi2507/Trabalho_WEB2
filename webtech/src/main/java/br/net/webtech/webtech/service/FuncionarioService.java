package br.net.webtech.webtech.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.net.webtech.webtech.model.Funcionario;
import br.net.webtech.webtech.model.FuncionarioCadastroDTO;
import br.net.webtech.webtech.model.FuncionarioCriadoDTO;
import br.net.webtech.webtech.model.FuncionarioRespostaDTO;
import br.net.webtech.webtech.model.Perfil;
import br.net.webtech.webtech.model.Usuario;
import br.net.webtech.webtech.repository.FuncionarioRepository;
import br.net.webtech.webtech.repository.PerfilRepository;
import br.net.webtech.webtech.repository.UsuarioRepository;
import br.net.webtech.webtech.seguranca.senhaUtil;

@Service
public class FuncionarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final PerfilRepository perfilRepository;

    public FuncionarioService(UsuarioRepository usuarioRepository, FuncionarioRepository funcionarioRepository,
            PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.perfilRepository = perfilRepository;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioRespostaDTO> listar() {
        return funcionarioRepository.findByUsuarioAtivoTrueOrderByIdAsc().stream().map(this::paraDTO).toList();
    }

    @Transactional( readOnly = true)
    public Optional<FuncionarioRespostaDTO> buscarPorId(Integer id) {
        return funcionarioRepository.findByIdAndUsuarioAtivoTrue(id).map(this::paraDTO);
    }
    
    @Transactional
    public FuncionarioCriadoDTO inserir(FuncionarioCadastroDTO dto) {
        String email = ClienteService.normalizarEmail(dto.email());
        if (usuarioRepository.existsByEmail(email)) {
            throw new CadastroConflitoException("email");
        }

        Perfil perfil = perfilRepository.findByCodigo("FUNCIONARIO")
                .orElseThrow(() -> new IllegalStateException("Perfil FUNCIONARIO não existe no banco."));

        // senha aleatória de 4 números + salt + hash 
        String senha = senhaUtil.gerarSenhaNumerica();
        String salt = senhaUtil.gerarSalt();

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(email);
        usuario.setSalt(salt);
        usuario.setSenhaHash(senhaUtil.gerarHash(salt, senha));
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);
        usuario = usuarioRepository.save(usuario);

        Funcionario funcionario = new Funcionario();
        funcionario.setUsuario(usuario);
        funcionario.setDataNascimento(dto.dataNascimento());
        funcionarioRepository.save(funcionario);

        return new FuncionarioCriadoDTO(usuario.getId(), usuario.getNome(), usuario.getEmail(),
                funcionario.getDataNascimento(), senha);
    }

    @Transactional
    public Optional<FuncionarioRespostaDTO> alterar(Integer id, FuncionarioCadastroDTO dto) {
        Optional<Funcionario> encontrado = funcionarioRepository.findByIdAndUsuarioAtivoTrue(id);
        if (encontrado.isEmpty()) {
            return Optional.empty();
        }

        String email = ClienteService.normalizarEmail(dto.email());
        if (usuarioRepository.existsByEmailAndIdNot(email, id)) {
            throw new CadastroConflitoException("email");
        }

        Funcionario funcionario = encontrado.get();
        Usuario usuario = funcionario.getUsuario();
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(email);
        funcionario.setDataNascimento(dto.dataNascimento());

        usuarioRepository.save(usuario);
        funcionarioRepository.save(funcionario);
        return Optional.of(paraDTO(funcionario));
    }

    @Transactional
    public boolean remover(Integer id, Integer idLogado) {
        Optional<Funcionario> encontrado = funcionarioRepository.findByIdAndUsuarioAtivoTrue(id);
        if (encontrado.isEmpty()) {
            return false;
        }
        if (id.equals(idLogado)) {
            throw new RegraNegocioException("Você não pode remover a si mesmo.");
        }
        if (funcionarioRepository.countByUsuarioAtivoTrue() <= 1) {
            throw new RegraNegocioException("Não é possível remover o único funcionário cadastrado.");
        }

        Usuario usuario = encontrado.get().getUsuario();
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
        return true;
    }

    private FuncionarioRespostaDTO paraDTO(Funcionario f) {
        return new FuncionarioRespostaDTO(f.getId(), f.getUsuario().getNome(), f.getUsuario().getEmail(),
                f.getDataNascimento());
    }

}

