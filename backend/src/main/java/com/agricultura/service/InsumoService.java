package com.agricultura.service;

import com.agricultura.domain.Insumo;
import com.agricultura.domain.MovimentoEstoque;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.InsumoRequest;
import com.agricultura.dto.InsumoResponse;
import com.agricultura.dto.MovimentoEstoqueRequest;
import com.agricultura.dto.MovimentoEstoqueResponse;
import com.agricultura.exception.BusinessException;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.InsumoRepository;
import com.agricultura.repository.MovimentoEstoqueRepository;
import com.agricultura.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InsumoService {

    private final InsumoRepository insumoRepository;
    private final MovimentoEstoqueRepository movimentoEstoqueRepository;
    private final UsuarioRepository usuarioRepository;

    public List<InsumoResponse> findAll(Long userId) {
        return insumoRepository.findByUserIdAndAtivoTrue(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public InsumoResponse findById(Long id, Long userId) {
        Insumo insumo =
                insumoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Insumo não encontrado"));

        if (!insumo.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este insumo");
        }

        return toResponse(insumo);
    }

    @Transactional
    public InsumoResponse create(InsumoRequest request, Long userId) {
        Usuario usuario = usuarioRepository.getReferenceById(userId);

        Insumo insumo = Insumo.builder()
                .nome(request.getNome())
                .tipo(request.getTipo())
                .quantidade(request.getQuantidade())
                .unidade(request.getUnidade())
                .precoUnitario(request.getPrecoUnitario())
                .dataValidade(request.getDataValidade())
                .fornecedor(request.getFornecedor())
                .estoqueMinimo(request.getEstoqueMinimo() != null ? request.getEstoqueMinimo() : BigDecimal.valueOf(10))
                .ativo(true)
                .user(usuario)
                .build();

        insumo = insumoRepository.save(insumo);

        // Registrar movimento de entrada inicial
        if (request.getQuantidade().compareTo(BigDecimal.ZERO) > 0) {
            registrarMovimento(insumo, usuario, "ENTRADA", request.getQuantidade(), "Cadastro inicial", "Sistema");
        }

        return toResponse(insumo);
    }

    @Transactional
    public InsumoResponse update(Long id, InsumoRequest request, Long userId) {
        Insumo insumo =
                insumoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Insumo não encontrado"));

        if (!insumo.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este insumo");
        }

        insumo.setNome(request.getNome());
        insumo.setTipo(request.getTipo());
        insumo.setPrecoUnitario(request.getPrecoUnitario());
        insumo.setDataValidade(request.getDataValidade());
        insumo.setFornecedor(request.getFornecedor());
        insumo.setEstoqueMinimo(
                request.getEstoqueMinimo() != null ? request.getEstoqueMinimo() : BigDecimal.valueOf(10));

        insumo = insumoRepository.save(insumo);
        return toResponse(insumo);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Insumo insumo =
                insumoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Insumo não encontrado"));

        if (!insumo.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este insumo");
        }

        insumo.setAtivo(false);
        insumoRepository.save(insumo);
    }

    @Transactional
    public MovimentoEstoqueResponse registrarMovimento(MovimentoEstoqueRequest request, Long userId) {
        Insumo insumo = insumoRepository
                .findById(request.getInsumoId())
                .orElseThrow(() -> new ResourceNotFoundException("Insumo não encontrado"));

        if (!insumo.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Acesso negado a este insumo");
        }

        Usuario usuario = usuarioRepository.getReferenceById(userId);

        return registrarMovimento(
                insumo,
                usuario,
                request.getTipo(),
                request.getQuantidade(),
                request.getMotivo(),
                request.getResponsavel());
    }

    private MovimentoEstoqueResponse registrarMovimento(
            Insumo insumo, Usuario usuario, String tipo, BigDecimal quantidade, String motivo, String responsavel) {
        BigDecimal quantidadeAnterior = insumo.getQuantidade();

        if ("ENTRADA".equals(tipo)) {
            insumo.setQuantidade(insumo.getQuantidade().add(quantidade));
        } else if ("SAIDA".equals(tipo)) {
            if (insumo.getQuantidade().compareTo(quantidade) < 0) {
                throw new BusinessException(
                        "Estoque insuficiente: disponível " + insumo.getQuantidade() + ", solicitado " + quantidade);
            }
            insumo.setQuantidade(insumo.getQuantidade().subtract(quantidade));
        }

        insumoRepository.save(insumo);

        MovimentoEstoque movimento = MovimentoEstoque.builder()
                .tipo(tipo)
                .quantidade(quantidade)
                .quantidadeAnterior(quantidadeAnterior)
                .quantidadeAtual(insumo.getQuantidade())
                .motivo(motivo)
                .responsavel(responsavel)
                .insumo(insumo)
                .user(usuario)
                .build();

        movimento = movimentoEstoqueRepository.save(movimento);

        return toResponse(movimento);
    }

    public Page<MovimentoEstoqueResponse> findMovimentosByInsumo(Long insumoId, Long userId, Pageable pageable) {
        return movimentoEstoqueRepository
                .findByInsumoIdAndUserId(insumoId, userId, pageable)
                .map(this::toResponse);
    }

    public Page<MovimentoEstoqueResponse> findMovimentosByUser(Long userId, Pageable pageable) {
        return movimentoEstoqueRepository.findByUserId(userId, pageable).map(this::toResponse);
    }

    public List<InsumoResponse> findEstoqueBaixo(Long userId) {
        return insumoRepository.findByUserIdAndAtivoTrue(userId).stream()
                .filter(insumo -> insumo.getQuantidade().compareTo(insumo.getEstoqueMinimo()) <= 0)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private InsumoResponse toResponse(Insumo insumo) {
        return InsumoResponse.builder()
                .id(insumo.getId())
                .nome(insumo.getNome())
                .tipo(insumo.getTipo())
                .quantidade(insumo.getQuantidade())
                .unidade(insumo.getUnidade())
                .precoUnitario(insumo.getPrecoUnitario())
                .dataValidade(insumo.getDataValidade())
                .fornecedor(insumo.getFornecedor())
                .estoqueMinimo(insumo.getEstoqueMinimo())
                .ativo(insumo.getAtivo())
                .estoqueBaixo(insumo.getQuantidade().compareTo(insumo.getEstoqueMinimo()) <= 0)
                .createdAt(insumo.getCreatedAt())
                .updatedAt(insumo.getUpdatedAt())
                .build();
    }

    private MovimentoEstoqueResponse toResponse(MovimentoEstoque movimento) {
        return MovimentoEstoqueResponse.builder()
                .id(movimento.getId())
                .tipo(movimento.getTipo())
                .quantidade(movimento.getQuantidade())
                .quantidadeAnterior(movimento.getQuantidadeAnterior())
                .quantidadeAtual(movimento.getQuantidadeAtual())
                .motivo(movimento.getMotivo())
                .responsavel(movimento.getResponsavel())
                .insumoId(movimento.getInsumo().getId())
                .insumoNome(movimento.getInsumo().getNome())
                .createdAt(movimento.getCreatedAt())
                .build();
    }
}
