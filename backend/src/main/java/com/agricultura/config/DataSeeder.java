package com.agricultura.config;

import com.agricultura.domain.Insumo;
import com.agricultura.domain.Notificacao;
import com.agricultura.domain.Usuario;
import com.agricultura.repository.InsumoRepository;
import com.agricultura.repository.NotificacaoRepository;
import com.agricultura.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@ConditionalOnProperty(value = "app.seeder.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final InsumoRepository insumoRepository;
    private final NotificacaoRepository notificacaoRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seeder.admin.email:admin@agricultura.com}")
    private String adminEmail;

    @Value("${app.seeder.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.seeder.user.email:usuario@agricultura.com}")
    private String userEmail;

    @Value("${app.seeder.user.password:user123}")
    private String userPassword;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            log.info("Criando usuários de teste...");

            Usuario admin = Usuario.builder()
                    .email(adminEmail)
                    .name("Administrador")
                    .password(passwordEncoder.encode(adminPassword))
                    .role("ADMIN")
                    .build();
            admin = usuarioRepository.save(admin);
            log.info("Usuário admin criado: {}", adminEmail);

            Usuario usuario = Usuario.builder()
                    .email(userEmail)
                    .name("Usuário Teste")
                    .password(passwordEncoder.encode(userPassword))
                    .role("USER")
                    .build();
            usuario = usuarioRepository.save(usuario);
            log.info("Usuário teste criado: {}", userEmail);

            criarNotificacoesExemplo(admin.getId());
            criarInsumosExemplo(admin.getId());

            log.info("Seed de dados concluído com sucesso!");
        }
    }

    private void criarNotificacoesExemplo(Long usuarioId) {
        log.info("Criando notificações de exemplo...");

        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();

        notificacaoRepository.save(Notificacao.builder()
                .usuario(usuario)
                .titulo("Irrigação necessária")
                .mensagem("Setor 3 - Milho requer irrigação urgente")
                .tipo("ALERTA")
                .lida(false)
                .dataCriacao(LocalDateTime.now().minusHours(2))
                .build());

        notificacaoRepository.save(Notificacao.builder()
                .usuario(usuario)
                .titulo("Praga detectada")
                .mensagem("Lavoura de soja - Área norte requer atenção")
                .tipo("ALERTA")
                .lida(false)
                .dataCriacao(LocalDateTime.now().minusHours(5))
                .build());

        notificacaoRepository.save(Notificacao.builder()
                .usuario(usuario)
                .titulo("Preço atualizado")
                .mensagem("Soja subiu 2.5% nas últimas 24h")
                .tipo("SUCESSO")
                .lida(false)
                .dataCriacao(LocalDateTime.now().minusDays(1))
                .build());

        notificacaoRepository.save(Notificacao.builder()
                .usuario(usuario)
                .titulo("Tarefa próxima do vencimento")
                .mensagem("Aplicação de defensivo vence em 2 dias")
                .tipo("AVISO")
                .lida(true)
                .dataCriacao(LocalDateTime.now().minusDays(2))
                .build());

        log.info("Notificações de exemplo criadas com sucesso!");
    }

    private void criarInsumosExemplo(Long usuarioId) {
        log.info("Criando insumos de exemplo...");

        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();

        insumoRepository.save(Insumo.builder()
                .nome("Ureia Agrícola")
                .tipo("FERTILIZANTE")
                .quantidade(new BigDecimal("500.00"))
                .unidade("KG")
                .precoUnitario(new BigDecimal("2.50"))
                .dataValidade(LocalDate.now().plusMonths(12))
                .fornecedor("Yara Brasil")
                .estoqueMinimo(new BigDecimal("100.00"))
                .ativo(true)
                .user(usuario)
                .build());

        insumoRepository.save(Insumo.builder()
                .nome("Glifosato 480")
                .tipo("HERBICIDA")
                .quantidade(new BigDecimal("15.00"))
                .unidade("L")
                .precoUnitario(new BigDecimal("45.00"))
                .dataValidade(LocalDate.now().plusMonths(18))
                .fornecedor("Nufarm")
                .estoqueMinimo(new BigDecimal("20.00"))
                .ativo(true)
                .user(usuario)
                .build());

        insumoRepository.save(Insumo.builder()
                .nome("Semente de Milho AG 7088")
                .tipo("SEMENTE")
                .quantidade(new BigDecimal("8.00"))
                .unidade("SC")
                .precoUnitario(new BigDecimal("320.00"))
                .dataValidade(LocalDate.now().plusMonths(6))
                .fornecedor("Agroceres")
                .estoqueMinimo(new BigDecimal("5.00"))
                .ativo(true)
                .user(usuario)
                .build());

        insumoRepository.save(Insumo.builder()
                .nome("Azoxistrobina")
                .tipo("FUNGICIDA")
                .quantidade(new BigDecimal("5.00"))
                .unidade("L")
                .precoUnitario(new BigDecimal("180.00"))
                .dataValidade(LocalDate.now().plusMonths(10))
                .fornecedor("Syngenta")
                .estoqueMinimo(new BigDecimal("10.00"))
                .ativo(true)
                .user(usuario)
                .build());

        insumoRepository.save(Insumo.builder()
                .nome("Cipermetrina")
                .tipo("INSETICIDA")
                .quantidade(new BigDecimal("3.00"))
                .unidade("L")
                .precoUnitario(new BigDecimal("95.00"))
                .dataValidade(LocalDate.now().plusMonths(14))
                .fornecedor("FMC")
                .estoqueMinimo(new BigDecimal("5.00"))
                .ativo(true)
                .user(usuario)
                .build());

        log.info("Insumos de exemplo criados com sucesso!");
    }
}
