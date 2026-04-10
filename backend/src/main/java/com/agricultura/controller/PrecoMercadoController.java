package com.agricultura.controller;

import com.agricultura.dto.*;
import com.agricultura.service.AuthService;
import com.agricultura.service.PrecoMercadoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/precos")
@RequiredArgsConstructor
public class PrecoMercadoController {

    private final PrecoMercadoService precoMercadoService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<PrecoMercadoResponse>> findAll() {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(precoMercadoService.findAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrecoMercadoResponse> findById(@PathVariable Long id) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(precoMercadoService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<PrecoMercadoResponse> create(@Valid @RequestBody PrecoMercadoRequest request) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(precoMercadoService.create(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrecoMercadoResponse> update(
            @PathVariable Long id, @Valid @RequestBody PrecoMercadoRequest request) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(precoMercadoService.update(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = authService.getCurrentUserId();
        precoMercadoService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
