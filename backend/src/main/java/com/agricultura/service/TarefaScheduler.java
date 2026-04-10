package com.agricultura.service;

import com.agricultura.domain.Tarefa;
import com.agricultura.repository.TarefaRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TarefaScheduler {

    private final TarefaRepository tarefaRepository;
    private final NotificacaoService notificacaoService;

    @Scheduled(cron = "0 0 8 * * *")
    public void verificarTarefasVencidas() {
        log.info("Iniciando verificação de tarefas vencidas...");

        LocalDate hoje = LocalDate.now();
        LocalDate amanha = hoje.plusDays(1);
        List<String> statusAtivos = List.of("PENDENTE", "EM_ANDAMENTO");

        List<Tarefa> tarefasRelevantes = tarefaRepository.findByDataVencimentoInAndStatusIn(
                List.of(hoje.minusDays(1), hoje, amanha), statusAtivos);

        for (Tarefa tarefa : tarefasRelevantes) {
            Long usuarioId = tarefa.getUser().getId();
            LocalDate dataVencimento = tarefa.getDataVencimento();

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
