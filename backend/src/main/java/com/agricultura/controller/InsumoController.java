package com.agricultura.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.agricultura.dto.*;
import com.agricultura.service.AuthService;
import com.agricultura.service.InsumoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoService insumoService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<InsumoResponse>> findAll() {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(insumoService.findAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsumoResponse> findById(@PathVariable Long id) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(insumoService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<InsumoResponse> create(@Valid @RequestBody InsumoRequest request) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(insumoService.create(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsumoResponse> update(@PathVariable Long id, @Valid @RequestBody InsumoRequest request) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(insumoService.update(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = authService.getCurrentUser().getId();
        insumoService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<InsumoResponse>> findEstoqueBaixo() {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(insumoService.findEstoqueBaixo(userId));
    }

    @PostMapping("/movimento")
    public ResponseEntity<MovimentoEstoqueResponse> registrarMovimento(
            @Valid @RequestBody MovimentoEstoqueRequest request) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(insumoService.registrarMovimento(request, userId));
    }

    @GetMapping("/{id}/movimentos")
    public ResponseEntity<Page<MovimentoEstoqueResponse>> findMovimentosByInsumo(
            @PathVariable Long id, @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(insumoService.findMovimentosByInsumo(id, pageable));
    }

    @GetMapping("/movimentos")
    public ResponseEntity<Page<MovimentoEstoqueResponse>> findTodosMovimentos(
            @PageableDefault(size = 10) Pageable pageable) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(insumoService.findMovimentosByUser(userId, pageable));
    }
}
