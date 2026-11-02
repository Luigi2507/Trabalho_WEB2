package br.net.webtech.webtech.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.net.webtech.webtech.model.CategoriaEquipamento;
import br.net.webtech.webtech.model.Cliente;
import br.net.webtech.webtech.model.HistoricoDTO;
import br.net.webtech.webtech.model.Solicitacao;
import br.net.webtech.webtech.model.SolicitacaoDTO;
import br.net.webtech.webtech.model.SolicitacaoHistorico;
import br.net.webtech.webtech.model.SolicitacaoNovaDTO;
import br.net.webtech.webtech.model.StatusSolicitacao;
import br.net.webtech.webtech.model.Usuario;
import br.net.webtech.webtech.repository.CategoriaEquipamentoRepository;
import br.net.webtech.webtech.repository.ClienteRepository;
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

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
            SolicitacaoHistoricoRepository historicoRepository,
            StatusSolicitacaoRepository statusRepository,
            CategoriaEquipamentoRepository categoriaRepository,
            ClienteRepository clienteRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.historicoRepository = historicoRepository;
        this.statusRepository = statusRepository;
        this.categoriaRepository = categoriaRepository;
        this.clienteRepository = clienteRepository;
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

    /** RF005 / RF008 / RF010: uma solicitação com todos os dados e o histórico completo. */
    @Transactional(readOnly = true)
    public SolicitacaoDTO obterPorId(Integer id) {
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

        registrarHistorico(s, s.getStatus(), cliente.getUsuario());
        return paraDTO(s, true);
    }

    /** RF006: ORCADA -> APROVADA */
    @Transactional
    public SolicitacaoDTO aprovar(Integer id) {
        Solicitacao s = buscar(id);
        exigirStatus(s, "ORCADA");
        mudarStatus(s, "APROVADA");
        return paraDTO(s, true);
    }

    /** RF007: ORCADA -> REJEITADA (guarda o motivo) */
    @Transactional
    public SolicitacaoDTO rejeitar(Integer id, String motivo) {
        Solicitacao s = buscar(id);
        exigirStatus(s, "ORCADA");
        s.setMotivoRejeicao(motivo.trim());
        mudarStatus(s, "REJEITADA");
        return paraDTO(s, true);
    }

    /** RF009: REJEITADA -> APROVADA (volta para o fluxo; o histórico registra quando) */
    @Transactional
    public SolicitacaoDTO resgatar(Integer id) {
        Solicitacao s = buscar(id);
        exigirStatus(s, "REJEITADA");
        mudarStatus(s, "APROVADA");
        return paraDTO(s, true);
    }

    /** RF010: ARRUMADA -> PAGA (registra a data/hora do pagamento) */
    @Transactional
    public SolicitacaoDTO pagar(Integer id) {
        Solicitacao s = buscar(id);
        exigirStatus(s, "ARRUMADA");
        s.setDataHoraPagamento(LocalDateTime.now());
        mudarStatus(s, "PAGA");
        return paraDTO(s, true);
    }

    // ---------------------------------------------------------------- auxiliares

    private Solicitacao buscar(Integer id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação não encontrada."));
    }

    private StatusSolicitacao status(String codigo) {
        return statusRepository.findByCodigo(codigo)
                .orElseThrow(() -> new IllegalStateException("Status " + codigo + " não existe no banco."));
    }

    /** Garante que a solicitação está no estado certo antes de mudar (senão vira 409). */
    private void exigirStatus(Solicitacao s, String esperado) {
        if (!s.getStatus().getCodigo().equals(esperado)) {
            throw new EstadoInvalidoException("Esta solicitação está " + s.getStatus().getCodigo()
                    + " e não pode passar por esta ação (esperado: " + esperado + ").");
        }
    }

    /** Troca o estado e já grava no histórico (quem fez: o cliente dono da solicitação). */
    private void mudarStatus(Solicitacao s, String codigoNovoStatus) {
        StatusSolicitacao novo = status(codigoNovoStatus);
        s.setStatus(novo);
        solicitacaoRepository.save(s);
        registrarHistorico(s, novo, s.getCliente().getUsuario());
    }

    private void registrarHistorico(Solicitacao s, StatusSolicitacao status, Usuario autor) {
        SolicitacaoHistorico h = new SolicitacaoHistorico();
        h.setSolicitacao(s);
        h.setStatus(status);
        h.setUsuario(autor);
        h.setDataHora(LocalDateTime.now());
        historicoRepository.save(h);
    }

    private SolicitacaoDTO paraDTO(Solicitacao s, boolean comHistorico) {
        List<HistoricoDTO> historico = comHistorico
                ? historicoRepository.findBySolicitacaoIdOrderByDataHoraAscIdAsc(s.getId())
                        .stream().map(this::paraHistoricoDTO).toList()
                : List.of();

        return new SolicitacaoDTO(
                s.getId(),
                s.getCliente().getId(),
                s.getCliente().getUsuario().getNome(),
                s.getDescricaoEquipamento(),
                s.getCategoria().getNome(),
                s.getDescricaoDefeito(),
                s.getDataHoraAbertura(),
                s.getStatus().getCodigo(),
                s.getValorOrcamento(),
                s.getMotivoRejeicao(),
                s.getDataHoraPagamento(),
                historico);
    }

    private HistoricoDTO paraHistoricoDTO(SolicitacaoHistorico h) {
        String nome = h.getUsuario().getNome();
        if ("CLIENTE".equals(h.getUsuario().getPerfil().getCodigo())) {
            nome = nome + " (Cliente)";
        }
        return new HistoricoDTO(h.getDataHora(), h.getStatus().getCodigo(), nome);
    }
}