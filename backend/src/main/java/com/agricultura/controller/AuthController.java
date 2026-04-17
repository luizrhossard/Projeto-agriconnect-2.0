package com.agricultura.controller;

import com.agricultura.dto.*;
import com.agricultura.service.AuthService;
import com.agricultura.service.UsuarioService;
import jakarta.validation.Valid;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${app.security.cookie.secure:true}")
    private boolean cookieSecure;

    @Value("${app.security.cookie.same-site:Lax}")
    private String cookieSameSite;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, buildAuthCookie(response.getToken()).toString())
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildAuthCookie(response.getToken()).toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearAuthCookie().toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getCurrentUser() {
        return ResponseEntity.ok(usuarioService.getCurrentUserResponse());
    }

    private ResponseCookie buildAuthCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpirationMs))
                .build();
    }

    private ResponseCookie clearAuthCookie() {
        return ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }
}
