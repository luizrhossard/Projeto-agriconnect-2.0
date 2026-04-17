package com.agricultura.controller;

import com.agricultura.dto.NotificacaoResponse;
import com.agricultura.service.AuthService;
import com.agricultura.service.NotificacaoService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listarPorUsuario() {
        Long usuarioId = authService.getCurrentUserId();
        return ResponseEntity.ok(notificacaoService.buscarPorUsuario(usuarioId));
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<List<NotificacaoResponse>> listarNaoLidas() {
        Long usuarioId = authService.getCurrentUserId();
        return ResponseEntity.ok(notificacaoService.buscarNaoLidas(usuarioId));
    }

    @GetMapping("/contagem")
    public ResponseEntity<Map<String, Long>> contarNaoLidas() {
        Long usuarioId = authService.getCurrentUserId();
        return ResponseEntity.ok(Map.of("quantidade", notificacaoService.contarNaoLidas(usuarioId)));
    }

    @PutMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Long id) {
        Long usuarioId = authService.getCurrentUserId();
        notificacaoService.marcarComoLida(id, usuarioId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLidas() {
        Long usuarioId = authService.getCurrentUserId();
        notificacaoService.marcarTodasComoLidas(usuarioId);
        return ResponseEntity.ok().build();
    }
}
