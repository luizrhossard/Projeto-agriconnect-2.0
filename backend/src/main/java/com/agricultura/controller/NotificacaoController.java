package com.agricultura.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.agricultura.dto.NotificacaoResponse;
import com.agricultura.service.NotificacaoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listarPorUsuario(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(notificacaoService.buscarPorUsuario(usuarioId));
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<List<NotificacaoResponse>> listarNaoLidas(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(notificacaoService.buscarNaoLidas(usuarioId));
    }

    @GetMapping("/contagem")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(Map.of("quantidade", notificacaoService.contarNaoLidas(usuarioId)));
    }

    @PutMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Long id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLidas(@RequestParam Long usuarioId) {
        notificacaoService.marcarTodasComoLidas(usuarioId);
        return ResponseEntity.ok().build();
    }
}
