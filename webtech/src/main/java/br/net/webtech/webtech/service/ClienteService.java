package br.net.webtech.webtech.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.net.webtech.webtech.model.Cliente;
import br.net.webtech.webtech.model.ClienteCadastroDTO;
import br.net.webtech.webtech.model.ClienteRespostaDTO;
import br.net.webtech.webtech.model.Endereco;
import br.net.webtech.webtech.model.Perfil;
import br.net.webtech.webtech.model.Usuario;
import br.net.webtech.webtech.repository.ClienteRepository;
import br.net.webtech.webtech.repository.PerfilRepository;
import br.net.webtech.webtech.repository.UsuarioRepository;
import br.net.webtech.webtech.seguranca.senhaUtil;

@Service
public class ClienteService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PerfilRepository perfilRepository;
    private final EmailService emailService;

    public ClienteService(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository,
            PerfilRepository perfilRepository, EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.perfilRepository = perfilRepository;
        this.emailService = emailService;
    }

    public static String normalizarEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    public boolean emailCadastrado(String email) {
        return usuarioRepository.existsByEmail(normalizarEmail(email));
    }

    public boolean cpfCadastrado(String cpf) {
        return clienteRepository.existsByCpf(cpf == null ? "" : cpf.trim());
    }

    /** Tudo dentro de UMA transação: se algo falhar no meio, nada fica gravado (rollback). */
    @Transactional
    public ClienteRespostaDTO cadastrar(ClienteCadastroDTO dto) {
        String email = normalizarEmail(dto.email());
        String cpf = dto.cpf().trim();

        if (!cpfValido(cpf)) {
            throw new IllegalArgumentException("CPF inválido.");
        }
        if (emailCadastrado(email)) {
            throw new CadastroConflitoException("email");
        }
        if (cpfCadastrado(cpf)) {
            throw new CadastroConflitoException("cpf");
        }

        Perfil perfil = perfilRepository.findByCodigo("CLIENTE")
                .orElseThrow(() -> new IllegalStateException("Perfil CLIENTE não existe no banco."));

        // senha aleatória de 4 números + salt + hash (só o hash vai pro banco)
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

        Endereco endereco = new Endereco();
        endereco.setCep(dto.cep().trim());
        endereco.setLogradouro(dto.logradouro().trim());
        endereco.setNumero(dto.numero().trim());
        endereco.setComplemento(
                dto.complemento() == null || dto.complemento().isBlank() ? null : dto.complemento().trim());
        endereco.setBairro(dto.bairro().trim());
        endereco.setCidade(dto.cidade().trim());
        endereco.setEstado(dto.estado().trim().toUpperCase());

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setCpf(cpf);
        cliente.setTelefone(dto.telefone().trim());
        cliente.setEndereco(endereco);
        clienteRepository.save(cliente);

        emailService.enviarSenha(email, usuario.getNome(), senha);

        return new ClienteRespostaDTO(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

    /** Mesma regra do CpfValidoDirective do Angular (dígitos verificadores). */
    static boolean cpfValido(String cpfComMascara) {
        String cpf = cpfComMascara.replaceAll("\\D", "");
        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            return false;
        }
        return digito(cpf, 9) == cpf.charAt(9) - '0' && digito(cpf, 10) == cpf.charAt(10) - '0';
    }

    private static int digito(String cpf, int base) {
        int soma = 0;
        for (int i = 0; i < base; i++) {
            soma += (cpf.charAt(i) - '0') * (base + 1 - i);
        }
        int resto = (soma * 10) % 11;
        return resto == 10 ? 0 : resto;
    }
}
