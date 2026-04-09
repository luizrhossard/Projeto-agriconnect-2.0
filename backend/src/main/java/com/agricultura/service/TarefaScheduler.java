package com.agricultura.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.agricultura.domain.Tarefa;
import com.agricultura.domain.Usuario;
import com.agricultura.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TarefaScheduler {

    private final TarefaService tarefaService;
    private final NotificacaoService notificacaoService;
    private final UsuarioRepository usuarioRepository;

    @Scheduled(cron = "0 0 8 * * *")
    public void verificarTarefasVencidas() {
        log.info("Iniciando verificação de tarefas vencidas...");

        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);

        List<Tarefa> tarefas = tarefaService.findAllTarefas();
        List<Usuario> usuarios = usuarioRepository.findAll();

        for (Tarefa tarefa : tarefas) {
            if (!"PENDENTE".equals(tarefa.getStatus()) && !"EM_ANDAMENTO".equals(tarefa.getStatus())) {
                continue;
            }

            LocalDate dataVencimento = tarefa.getDataVencimento();
            Long usuarioId = tarefa.getUser().getId();

            if (dataVencimento.isBefore(hoje)) {
                notificacaoService.criarNotificacao(
                        usuarioId, "Tarefa atrasada", tarefa.getTitulo() + " - Venceu em " + dataVencimento, "ALERTA");
                log.info("Notificação de tarefa atrasada enviada para usuário {}: {}", usuarioId, tarefa.getTitulo());
            } else if (dataVencimento.equals(amanha)) {
                notificacaoService.criarNotificacao(usuarioId, "Tarefa vence amanhã", tarefa.getTitulo(), "AVISO");
                log.info("Notificação de tarefa amanhã enviada para usuário {}: {}", usuarioId, tarefa.getTitulo());
            }
        }

        log.info("Verificação de tarefas concluída.");
    }
}
