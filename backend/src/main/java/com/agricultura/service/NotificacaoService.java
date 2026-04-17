package com.agricultura.service;

import com.agricultura.domain.Notificacao;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.NotificacaoResponse;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.NotificacaoRepository;
import com.agricultura.repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<NotificacaoResponse> buscarPorUsuario(Long usuarioId) {
        return notificacaoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<NotificacaoResponse> buscarNaoLidas(Long usuarioId) {
        return notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Long contarNaoLidas(Long usuarioId) {
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    @Transactional
    public void criarNotificacao(Long usuarioId, String titulo, String mensagem, String tipo) {
        Usuario usuario = usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() -> new com.agricultura.exception.ResourceNotFoundException("Usuário não encontrado"));

        Notificacao notificacao = Notificacao.builder()
                .usuario(usuario)
                .titulo(titulo)
                .mensagem(mensagem)
                .tipo(tipo != null ? tipo : "INFO")
                .lida(false)
                .build();

        notificacaoRepository.save(notificacao);
    }

    @Transactional
    public void marcarComoLida(Long notificacaoId, Long usuarioId) {
        Notificacao notificacao = notificacaoRepository
                .findByIdAndUsuarioId(notificacaoId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("NotificaÃ§Ã£o nÃ£o encontrada"));

        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
    }

    @Transactional
    public void marcarTodasComoLidas(Long usuarioId) {
        List<Notificacao> notificacoes =
                notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId);
        notificacoes.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    private NotificacaoResponse toResponse(Notificacao notificacao) {
        return NotificacaoResponse.builder()
                .id(notificacao.getId())
                .titulo(notificacao.getTitulo())
                .mensagem(notificacao.getMensagem())
                .tipo(notificacao.getTipo())
                .lida(notificacao.getLida())
                .dataCriacao(notificacao.getDataCriacao())
                .build();
    }
}
