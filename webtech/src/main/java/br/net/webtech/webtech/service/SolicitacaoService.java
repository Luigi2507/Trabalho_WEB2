package br.net.webtech.webtech.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.model.Cliente;
import br.net.webtech.webtech.model.Funcionario;
import br.net.webtech.webtech.model.Solicitacao;
import br.net.webtech.webtech.model.SolicitacaoHistorico;
import br.net.webtech.webtech.model.StatusSolicitacao;
import br.net.webtech.webtech.model.Usuario;
import br.net.webtech.webtech.model.dto.ClienteDTO;
import br.net.webtech.webtech.model.dto.HistoricoDTO;
import br.net.webtech.webtech.model.dto.SolicitacaoDTO;
import br.net.webtech.webtech.model.dto.SolicitacaoNovaDTO;
import br.net.webtech.webtech.repository.CategoriaEquipamentoRepository;
import br.net.webtech.webtech.repository.ClienteRepository;
import br.net.webtech.webtech.repository.FuncionarioRepository;
import br.net.webtech.webtech.repository.SolicitacaoHistoricoRepository;
import br.net.webtech.webtech.repository.SolicitacaoRepository;
import br.net.webtech.webtech.repository.StatusSolicitacaoRepository;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitacaoHistoricoRepository historicoRepository;
    private final StatusSolicitacaoRepository statusRepository;
    private final CategoriaEquipamentoRepository categoriaRepository;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
            SolicitacaoHistoricoRepository historicoRepository,
            StatusSolicitacaoRepository statusRepository,
            CategoriaEquipamentoRepository categoriaRepository,
            ClienteRepository clienteRepository,
            FuncionarioRepository funcionarioRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.historicoRepository = historicoRepository;
        this.statusRepository = statusRepository;
        this.categoriaRepository = categoriaRepository;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    /** RF003: lista do cliente, ordem crescente de data/hora (a lista não traz o histórico). */
    @Transactional(readOnly = true)
    public List<SolicitacaoDTO> listarPorCliente(Integer clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new RecursoNaoEncontradoException("Cliente não encontrado.");
        }
        return solicitacaoRepository.findByClienteIdOrderByDataHoraAbertura(clienteId)
                .stream()
                .map(s -> paraDTO(s, false))
                .toList();
    }

    /** RF005 / RF008 / RF010: uma solicitação do cliente, com todos os dados e o histórico completo. */
    @Transactional(readOnly = true)
    public SolicitacaoDTO obterPorId(Integer id, Integer clienteId) {
        return paraDTO(buscarDoCliente(id, clienteId), true);
    }

    @Transactional(readOnly = true)
    public SolicitacaoDTO obterParaFuncionario(Integer id) {
        return paraDTO(buscar(id), true);
    }

    /** RF004: nasce no estado ABERTA, com data/hora de agora e a 1ª linha do histórico. */
    @Transactional
    public SolicitacaoDTO criar(SolicitacaoNovaDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado."));
        CategoriaEquipamento categoria = categoriaRepository.findByIdAndAtivoTrue(dto.categoriaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada."));

        Solicitacao s = new Solicitacao();
        s.setCliente(cliente);
        s.setCategoria(categoria);
        s.setDescricaoEquipamento(dto.descricaoEquipamento().trim());
        s.setDescricaoDefeito(dto.descricaoDefeito().trim());
        s.setStatus(status("ABERTA"));
        s.setDataHoraAbertura(LocalDateTime.now());
        s = solicitacaoRepository.save(s);

        registrarHistorico(s, s.getStatus(), cliente.getUsuario(), null);
        return paraDTO(s, true);
    }

    /** RF006: ORCADA -> APROVADA */
    @Transactional
    public SolicitacaoDTO aprovar(Integer id, Integer clienteId) {
        Solicitacao s = buscarDoCliente(id, clienteId);
        exigirStatus(s, "ORCADA");
        mudarStatus(s, "APROVADA");
        return paraDTO(s, true);
    }

    /** RF007: ORCADA -> REJEITADA (guarda o motivo) */
    @Transactional
    public SolicitacaoDTO rejeitar(Integer id, Integer clienteId, String motivo) {
        Solicitacao s = buscarDoCliente(id, clienteId);
        exigirStatus(s, "ORCADA");
        s.setMotivoRejeicao(motivo.trim());
        mudarStatus(s, "REJEITADA");
        return paraDTO(s, true);
    }

    /** RF009: REJEITADA -> APROVADA (volta para o fluxo; o histórico registra quando) */
    @Transactional
    public SolicitacaoDTO resgatar(Integer id, Integer clienteId) {
        Solicitacao s = buscarDoCliente(id, clienteId);
        exigirStatus(s, "REJEITADA");
        mudarStatus(s, "APROVADA");
        return paraDTO(s, true);
    }

    /** RF010: ARRUMADA -> PAGA (registra a data/hora do pagamento) */
    @Transactional
    public SolicitacaoDTO pagar(Integer id, Integer clienteId) {
        Solicitacao s = buscarDoCliente(id, clienteId);
        exigirStatus(s, "ARRUMADA");
        s.setDataHoraPagamento(LocalDateTime.now());
        mudarStatus(s, "PAGA");
        return paraDTO(s, true);
    }

    /** RF011 / RF013 */
    @Transactional(readOnly = true)
    public List<SolicitacaoDTO> listar(String status){
        List<Solicitacao> lista  = (status == null)
            ? solicitacaoRepository.findAllByOrderByDataHoraAberturaAsc()
            : solicitacaoRepository.findByStatusCodigoOrderByDataHoraAberturaAsc(status);
    
        return lista.stream().map(s -> paraDTO(s, false)).toList();
    }

    /** RF012: ABERTA -> ORCADA (registra valor, funcionário e data/hora do orçamento) */
    @Transactional
    public SolicitacaoDTO orcar(Integer id, Integer funcionarioId, BigDecimal valor) {
        Funcionario f = buscarFuncionario(funcionarioId);
        Solicitacao s = buscar(id);
        exigirStatus(s, "ABERTA");

        s.setValorOrcamento(valor.setScale(2, RoundingMode.HALF_UP));
        s.setOrcamentoFuncionario(f);
        s.setDataHoraOrcamento(LocalDateTime.now());
        mudarStatusPorFuncionario(s, "ORCADA", f, null);
        return paraDTO(s, true);
    }

    /** RF014: APROVADA ou REDIRECIONADA (para este funcionário) -> ARRUMADA */
    @Transactional
    public SolicitacaoDTO efetuarManutencao(Integer id, Integer funcionarioId, String descricao, String orientacoes) {
        Funcionario f = buscarFuncionario(funcionarioId);
        Solicitacao s = buscar(id);
        exigirStatus(s, "APROVADA", "REDIRECIONADA");
        exigirResponsavel(s, funcionarioId);

        s.setDescricaoManutencao(descricao.trim());
        s.setOrientacoesCliente(orientacoes.trim());
        s.setManutencaoFuncionario(f);
        s.setDataHoraManutencao(LocalDateTime.now());
        s.setFuncionarioAtual(f);
        mudarStatusPorFuncionario(s, "ARRUMADA", f, null);
        return paraDTO(s, true);
    }

    /** RF015: APROVADA ou REDIRECIONADA -> REDIRECIONADA para outro funcionário (nunca para si mesmo) */
    @Transactional
    public SolicitacaoDTO redirecionar(Integer id, Integer funcionarioId, Integer destinoId) {
        Funcionario origem = buscarFuncionario(funcionarioId);
        Solicitacao s = buscar(id);
        exigirStatus(s, "APROVADA", "REDIRECIONADA");
        exigirResponsavel(s, funcionarioId);

        if (destinoId.equals(funcionarioId)) {
            throw new IllegalArgumentException("Não é possível redirecionar para si mesmo.");
        }
        Funcionario destino = buscarFuncionario(destinoId);

        s.setFuncionarioAtual(destino);
        mudarStatusPorFuncionario(s, "REDIRECIONADA", origem, destino);
        return paraDTO(s, true);
    }

    /** RF016: PAGA -> FINALIZADA (registra funcionário e data/hora da finalização) */
    @Transactional
    public SolicitacaoDTO finalizar(Integer id, Integer funcionarioId) {
        Funcionario f = buscarFuncionario(funcionarioId);
        Solicitacao s = buscar(id);
        exigirStatus(s, "PAGA");

        s.setFinalizacaoFuncionario(f);
        s.setDataHoraFinalizacao(LocalDateTime.now());
        mudarStatusPorFuncionario(s, "FINALIZADA", f, null);
        return paraDTO(s, true);
    }

    // ---------------------------------------------------------------- auxiliares

    private Solicitacao buscar(Integer id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada."));
    }

    //evitar que outro usuário acesse a solicitação pela URL
    private Solicitacao buscarDoCliente(Integer id, Integer clienteId) {
        Solicitacao s = buscar(id);
        if (!s.getCliente().getId().equals(clienteId)) {
            throw new RecursoNaoEncontradoException("Solicitação não encontrada.");
        }
        return s;
    }

    private Funcionario buscarFuncionario(Integer id) {
        return funcionarioRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário não encontrado."));
    }

    private StatusSolicitacao status(String codigo) {
        return statusRepository.findByCodigo(codigo)
                .orElseThrow(() -> new IllegalStateException("Status " + codigo + " não existe no banco."));
    }

    /** Garante que a solicitação está num dos estados permitidos antes de mudar (senão vira 409). */
    private void exigirStatus(Solicitacao s, String... permitidos) {
        String atual = s.getStatus().getCodigo();
        for (String p : permitidos) {
            if (p.equals(atual)) {
                return;
            }
        }
        throw new EstadoInvalidoException("Esta solicitação está " + atual
                + " e não pode passar por esta ação (esperado: " + String.join(" ou ", permitidos) + ").");
    }

    /** Se está REDIRECIONADA, só o funcionário de destino pode agir. */
    private void exigirResponsavel(Solicitacao s, Integer funcionarioId) {
        boolean redirecionada = "REDIRECIONADA".equals(s.getStatus().getCodigo());
        boolean ehOResponsavel = s.getFuncionarioAtual() != null
                && s.getFuncionarioAtual().getId().equals(funcionarioId);
        if (redirecionada && !ehOResponsavel) {
            throw new EstadoInvalidoException("Esta solicitação foi redirecionada para outro funcionário.");
        }
    }

    /** Troca o estado e já grava no histórico (quem fez: o cliente dono da solicitação). */
    private void mudarStatus(Solicitacao s, String codigoNovoStatus) {
        StatusSolicitacao novo = status(codigoNovoStatus);
        s.setStatus(novo);
        solicitacaoRepository.save(s);
        registrarHistorico(s, novo, s.getCliente().getUsuario(), null);
    }

    /** Igual ao mudarStatus, mas quem fez é um funcionário (e, no redirecionamento, vai o destino). */
    private void mudarStatusPorFuncionario(Solicitacao s, String codigoNovoStatus, Funcionario autor, Funcionario destino) {
        StatusSolicitacao novo = status(codigoNovoStatus);
        s.setStatus(novo);
        solicitacaoRepository.save(s);
        registrarHistorico(s, novo, autor.getUsuario(), destino == null ? null : destino.getUsuario());
    }

    private void registrarHistorico(Solicitacao s, StatusSolicitacao status, Usuario autor, Usuario destino) {
        SolicitacaoHistorico h = new SolicitacaoHistorico();
        h.setSolicitacao(s);
        h.setStatus(status);
        h.setUsuario(autor);
        h.setUsuarioDestino(destino);
        h.setDataHora(LocalDateTime.now());
        historicoRepository.save(h);
    }

    private String nome(Funcionario f) {
        return f == null ? null : f.getUsuario().getNome();
    }

    private SolicitacaoDTO paraDTO(Solicitacao s, boolean comHistorico) {
        List<HistoricoDTO> historico = comHistorico
                ? historicoRepository.findBySolicitacaoIdOrderByDataHoraAscIdAsc(s.getId())
                        .stream().map(this::paraHistoricoDTO).toList()
                : List.of();

        ClienteDTO clienteDTO = ClienteDTO.de(s.getCliente());

        return new SolicitacaoDTO(
                s.getId(),
                s.getCliente().getId(),
                clienteDTO,
                s.getDescricaoEquipamento(),
                s.getCategoria().getNome(),
                s.getDescricaoDefeito(),
                s.getDataHoraAbertura(),
                s.getStatus().getCodigo(),
                s.getValorOrcamento(),
                s.getMotivoRejeicao(),
                s.getDataHoraPagamento(),
                historico,
                nome(s.getOrcamentoFuncionario()),
                s.getDescricaoManutencao(),
                s.getOrientacoesCliente(),
                nome(s.getManutencaoFuncionario()),
                nome(s.getFuncionarioAtual()),
                nome(s.getFinalizacaoFuncionario()),
                s.getDataHoraFinalizacao());
    }

    private HistoricoDTO paraHistoricoDTO(SolicitacaoHistorico h) {
        String perfil = h.getUsuario().getPerfil().getCodigo();
        String nome = h.getUsuario().getNome() + ("CLIENTE".equals(perfil) ? " (Cliente)" : " (Funcionário)");
        if (h.getUsuarioDestino() != null) {
            nome = nome + " → " + h.getUsuarioDestino().getNome();
        }
        return new HistoricoDTO(h.getDataHora(), h.getStatus().getCodigo(), nome);
    }
}