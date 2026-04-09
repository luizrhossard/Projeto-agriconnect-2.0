package com.agricultura.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agricultura.domain.Cultura;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.CulturaRequest;
import com.agricultura.dto.CulturaResponse;
import com.agricultura.repository.CulturaRepository;
import com.agricultura.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CulturaService {

    private final CulturaRepository culturaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<CulturaResponse> findAll(Long userId) {
        return culturaRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CulturaResponse findById(Long id, Long userId) {
        Cultura cultura =
                culturaRepository.findById(id).orElseThrow(() -> new RuntimeException("Cultura não encontrada"));

        if (!cultura.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado a esta cultura");
        }

        return toResponse(cultura);
    }

    @Transactional
    public CulturaResponse create(CulturaRequest request, Long userId) {
        Usuario usuario =
                usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Cultura cultura = Cultura.builder()
                .nome(request.getNome())
                .area(java.math.BigDecimal.valueOf(request.getArea()))
                .status(request.getStatus() != null ? request.getStatus() : "PLANTADO")
                .dataPlantio(request.getDataPlantio())
                .previsaoColheita(request.getPrevisaoColheita())
                .icone(request.getIcone())
                .progress(request.getProgress() != null ? request.getProgress() : 0)
                .user(usuario)
                .build();

        cultura = culturaRepository.save(cultura);

        return toResponse(cultura);
    }

    @Transactional
    public CulturaResponse update(Long id, CulturaRequest request, Long userId) {
        Cultura cultura =
                culturaRepository.findById(id).orElseThrow(() -> new RuntimeException("Cultura não encontrada"));

        if (!cultura.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado a esta cultura");
        }

        cultura.setNome(request.getNome());
        cultura.setArea(java.math.BigDecimal.valueOf(request.getArea()));
        if (request.getStatus() != null) {
            cultura.setStatus(request.getStatus());
        }
        cultura.setDataPlantio(request.getDataPlantio());
        cultura.setPrevisaoColheita(request.getPrevisaoColheita());
        if (request.getIcone() != null) {
            cultura.setIcone(request.getIcone());
        }
        if (request.getProgress() != null) {
            cultura.setProgress(request.getProgress());
        }

        cultura = culturaRepository.save(cultura);

        return toResponse(cultura);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Cultura cultura =
                culturaRepository.findById(id).orElseThrow(() -> new RuntimeException("Cultura não encontrada"));

        if (!cultura.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado a esta cultura");
        }

        culturaRepository.delete(cultura);
    }

    private CulturaResponse toResponse(Cultura cultura) {
        return CulturaResponse.builder()
                .id(cultura.getId())
                .nome(cultura.getNome())
                .area(cultura.getArea())
                .status(cultura.getStatus())
                .dataPlantio(cultura.getDataPlantio())
                .previsaoColheita(cultura.getPrevisaoColheita())
                .icone(cultura.getIcone())
                .progress(cultura.getProgress())
                .userId(cultura.getUser().getId())
                .createdAt(cultura.getCreatedAt())
                .updatedAt(cultura.getUpdatedAt())
                .build();
    }
}
