package com.agricultura.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.agricultura.dto.*;
import com.agricultura.service.AuthService;
import com.agricultura.service.TarefaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tarefas")
@RequiredArgsConstructor
public class TarefaController {

    private final TarefaService tarefaService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<TarefaResponse>> findAll() {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(tarefaService.findAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarefaResponse> findById(@PathVariable Long id) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(tarefaService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<TarefaResponse> create(@Valid @RequestBody TarefaRequest request) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaService.create(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarefaResponse> update(@PathVariable Long id, @Valid @RequestBody TarefaRequest request) {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(tarefaService.update(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = authService.getCurrentUser().getId();
        tarefaService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
