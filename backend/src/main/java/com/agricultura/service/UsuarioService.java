package com.agricultura.service;

import com.agricultura.domain.Usuario;
import com.agricultura.dto.UsuarioResponse;
import com.agricultura.repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public UsuarioResponse getCurrentUserResponse() {
        Usuario usuario = authService.getCurrentUser();
        return toResponse(usuario);
    }

    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .name(usuario.getName())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .createdAt(usuario.getCreatedAt())
                .build();
    }
}
