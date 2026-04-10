package com.agricultura.service;

import com.agricultura.domain.Usuario;
import com.agricultura.dto.*;
import com.agricultura.exception.BusinessException;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.UsuarioRepository;
import com.agricultura.security.CustomUserDetails;
import com.agricultura.security.JwtService;
import com.agricultura.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginAttemptService loginAttemptService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email já está em uso");
        }

        String sanitizedName = HtmlSanitizer.sanitize(request.getName());

        Usuario usuario = Usuario.builder()
                .name(sanitizedName)
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        usuario = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(usuario.getId())
                .name(usuario.getName())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (loginAttemptService.isBlocked(email)) {
            long remainingMinutes = loginAttemptService.getRemainingLockMinutes(email);
            throw new BusinessException(
                "Conta temporariamente bloqueada. Tente novamente em " + remainingMinutes + " minutos.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));

            loginAttemptService.loginSucceeded(email);

            Usuario usuario = usuarioRepository
                    .findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

            String token = jwtService.generateToken(usuario);

            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .id(usuario.getId())
                    .name(usuario.getName())
                    .email(usuario.getEmail())
                    .role(usuario.getRole())
                    .build();
        } catch (org.springframework.security.core.AuthenticationException e) {
            loginAttemptService.loginFailed(email);
            throw e;
        }
    }

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getUserId();
        }
        throw new ResourceNotFoundException("Usuário não autenticado");
    }

    public Usuario getCurrentUser() {
        Long userId = getCurrentUserId();
        return usuarioRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }
}
