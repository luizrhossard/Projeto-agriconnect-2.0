package com.agricultura.service;

import com.agricultura.domain.Cultura;
import com.agricultura.domain.Tarefa;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.TarefaRequest;
import com.agricultura.dto.TarefaResponse;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.CulturaRepository;
import com.agricultura.repository.TarefaRepository;
import com.agricultura.repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final CulturaRepository culturaRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    @Transactional(readOnly = true)
    public List<TarefaResponse> findAll(Long userId) {
        return tarefaRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TarefaResponse findById(Long id, Long userId) {
        Tarefa tarefa =
                tarefaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tarefa nao encontrada"));

        if (!tarefa.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado a esta tarefa");
        }

        return toResponse(tarefa);
    }

    @Transactional
    public TarefaResponse create(TarefaRequest request, Long userId) {
        Usuario usuario = usuarioRepository.getReferenceById(userId);

        Tarefa tarefa = Tarefa.builder()
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .prioridade(request.getPrioridade() != null ? request.getPrioridade() : "MEDIA")
                .status(request.getStatus() != null ? request.getStatus() : "PENDENTE")
                .dataVencimento(request.getDataVencimento())
                .user(usuario)
                .build();

        if (request.getCulturaId() != null) {
            tarefa.setCultura(buscarCulturaDoUsuario(request.getCulturaId(), userId));
        }

        tarefa = tarefaRepository.save(tarefa);

        notificacaoService.criarNotificacao(userId, "Nova tarefa criada", tarefa.getTitulo(), "INFO");

        return toResponse(tarefa);
    }

    @Transactional
    public TarefaResponse update(Long id, TarefaRequest request, Long userId) {
        Tarefa tarefa =
                tarefaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tarefa nao encontrada"));

        if (!tarefa.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado a esta tarefa");
        }

        tarefa.setTitulo(request.getTitulo());
        tarefa.setDescricao(request.getDescricao());
        if (request.getPrioridade() != null) {
            tarefa.setPrioridade(request.getPrioridade());
        }
        String statusAnterior = tarefa.getStatus();
        if (request.getStatus() != null) {
            tarefa.setStatus(request.getStatus());
        }
        tarefa.setDataVencimento(request.getDataVencimento());

        if (request.getCulturaId() != null) {
            tarefa.setCultura(buscarCulturaDoUsuario(request.getCulturaId(), userId));
        } else {
            tarefa.setCultura(null);
        }

        tarefa = tarefaRepository.save(tarefa);

        if (request.getStatus() != null
                && "CONCLUIDA".equals(request.getStatus())
                && !request.getStatus().equals(statusAnterior)) {
            notificacaoService.criarNotificacao(userId, "Tarefa concluida", tarefa.getTitulo(), "SUCESSO");
        }

        return toResponse(tarefa);
    }

    @Transactional(readOnly = true)
    public List<Tarefa> findAllTarefas() {
        return tarefaRepository.findAll();
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Tarefa tarefa =
                tarefaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tarefa nao encontrada"));

        if (!tarefa.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado a esta tarefa");
        }

        tarefaRepository.delete(tarefa);
    }

    private Cultura buscarCulturaDoUsuario(Long culturaId, Long userId) {
        Cultura cultura = culturaRepository
                .findById(culturaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cultura nao encontrada"));

        if (cultura.getUser() == null || !cultura.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado a esta cultura");
        }

        return cultura;
    }

    private TarefaResponse toResponse(Tarefa tarefa) {
        return TarefaResponse.builder()
                .id(tarefa.getId())
                .titulo(tarefa.getTitulo())
                .descricao(tarefa.getDescricao())
                .prioridade(tarefa.getPrioridade())
                .status(tarefa.getStatus())
                .dataVencimento(tarefa.getDataVencimento())
                .culturaId(tarefa.getCultura() != null ? tarefa.getCultura().getId() : null)
                .culturaNome(tarefa.getCultura() != null ? tarefa.getCultura().getNome() : null)
                .userId(tarefa.getUser().getId())
                .createdAt(tarefa.getCreatedAt())
                .updatedAt(tarefa.getUpdatedAt())
                .build();
    }
}
