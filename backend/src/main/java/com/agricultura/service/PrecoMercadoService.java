package com.agricultura.service;

import com.agricultura.domain.PrecoMercado;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.PrecoMercadoRequest;
import com.agricultura.dto.PrecoMercadoResponse;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.PrecoMercadoRepository;
import com.agricultura.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PrecoMercadoService {

    private final PrecoMercadoRepository precoMercadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    private static final double LIMITE_VARIACAO = 5.0;

    @Transactional(readOnly = true)
    public List<PrecoMercadoResponse> findAll(Long userId) {
        return precoMercadoRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PrecoMercadoResponse findById(Long id, Long userId) {
        PrecoMercado preco = precoMercadoRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Preço de mercado não encontrado"));

        if (!preco.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este preço");
        }

        return toResponse(preco);
    }

    @Transactional
    public PrecoMercadoResponse create(PrecoMercadoRequest request, Long userId) {
        Usuario usuario = usuarioRepository.getReferenceById(userId);

        PrecoMercado preco = PrecoMercado.builder()
                .produto(request.getProduto())
                .preco(request.getPreco())
                .unidade(request.getUnidade() != null ? request.getUnidade() : "sc")
                .variacao(request.getVariacao())
                .user(usuario)
                .build();

        preco = precoMercadoRepository.save(preco);

        return toResponse(preco);
    }

    @Transactional
    public PrecoMercadoResponse update(Long id, PrecoMercadoRequest request, Long userId) {
        PrecoMercado preco = precoMercadoRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Preço de mercado não encontrado"));

        if (!preco.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este preço");
        }

        BigDecimal precoAnterior = preco.getPreco();

        preco.setProduto(request.getProduto());
        preco.setPreco(request.getPreco());
        if (request.getUnidade() != null) {
            preco.setUnidade(request.getUnidade());
        }
        preco.setVariacao(request.getVariacao());

        preco = precoMercadoRepository.save(preco);

        BigDecimal precoAtual = request.getPreco();
        if (precoAnterior.compareTo(BigDecimal.ZERO) > 0 && precoAtual.compareTo(precoAnterior) != 0) {
            BigDecimal variacaoPercentual = precoAtual
                    .subtract(precoAnterior)
                    .divide(precoAnterior, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            if (variacaoPercentual.compareTo(BigDecimal.valueOf(LIMITE_VARIACAO)) > 0) {
                notificacaoService.criarNotificacao(
                        userId,
                        preco.getProduto() + " subiu!",
                        String.format("%.1f%% de aumento", variacaoPercentual),
                        "ALERTA");
            } else if (variacaoPercentual.compareTo(BigDecimal.valueOf(-LIMITE_VARIACAO)) < 0) {
                notificacaoService.criarNotificacao(
                        userId,
                        preco.getProduto() + " caiu",
                        String.format("%.1f%% de queda", variacaoPercentual.abs()),
                        "ALERTA");
            }
        }

        return toResponse(preco);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        PrecoMercado preco = precoMercadoRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Preço de mercado não encontrado"));

        if (!preco.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este preço");
        }

        precoMercadoRepository.delete(preco);
    }

    private PrecoMercadoResponse toResponse(PrecoMercado preco) {
        return PrecoMercadoResponse.builder()
                .id(preco.getId())
                .produto(preco.getProduto())
                .preco(preco.getPreco())
                .unidade(preco.getUnidade())
                .variacao(preco.getVariacao())
                .dataAtualizacao(preco.getDataAtualizacao())
                .userId(preco.getUser() != null ? preco.getUser().getId() : null)
                .build();
    }
}
