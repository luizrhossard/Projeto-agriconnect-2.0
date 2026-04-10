package com.agricultura.controller;

import com.agricultura.dto.*;
import com.agricultura.service.AuthService;
import com.agricultura.service.CulturaService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/culturas")
@RequiredArgsConstructor
public class CulturaController {

    private final CulturaService culturaService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<CulturaResponse>> findAll() {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(culturaService.findAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CulturaResponse> findById(@PathVariable Long id) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(culturaService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<CulturaResponse> create(@Valid @RequestBody CulturaRequest request) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(culturaService.create(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CulturaResponse> update(@PathVariable Long id, @Valid @RequestBody CulturaRequest request) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(culturaService.update(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = authService.getCurrentUserId();
        culturaService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
