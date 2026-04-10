package com.agricultura.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.agricultura.domain.Cultura;
import com.agricultura.domain.Tarefa;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.TarefaRequest;
import com.agricultura.dto.TarefaResponse;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.CulturaRepository;
import com.agricultura.repository.TarefaRepository;
import com.agricultura.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class TarefaServiceTest {

    @Mock
    private TarefaRepository tarefaRepository;

    @Mock
    private CulturaRepository culturaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NotificacaoService notificacaoService;

    @InjectMocks
    private TarefaService tarefaService;

    private Usuario usuario;
    private Cultura cultura;
    private Tarefa tarefa;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        cultura = Cultura.builder().id(1L).nome("Milho").build();

        tarefa = Tarefa.builder()
                .id(1L)
                .titulo("Regar cultura")
                .descricao("Aplicar irrigação")
                .prioridade("ALTA")
                .status("PENDENTE")
                .dataVencimento(LocalDate.now().plusDays(7))
                .user(usuario)
                .cultura(cultura)
                .build();
    }

    @Test
    void findAll_ReturnsTarefas() {
        when(tarefaRepository.findByUserId(1L)).thenReturn(List.of(tarefa));

        List<TarefaResponse> result = tarefaService.findAll(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Regar cultura", result.get(0).getTitulo());
    }

    @Test
    void findById_Success() {
        when(tarefaRepository.findById(1L)).thenReturn(Optional.of(tarefa));

        TarefaResponse result = tarefaService.findById(1L, 1L);

        assertNotNull(result);
        assertEquals("Regar cultura", result.getTitulo());
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(tarefaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tarefaService.findById(1L, 1L));
    }

    @Test
    void findById_AccessDenied_ThrowsException() {
        when(tarefaRepository.findById(1L)).thenReturn(Optional.of(tarefa));

        assertThrows(
                org.springframework.security.access.AccessDeniedException.class,
                () -> tarefaService.findById(1L, 999L));
    }

    @Test
    void create_Success() {
        TarefaRequest request = new TarefaRequest();
        request.setTitulo("Nova tarefa");
        request.setDescricao("Descrição da tarefa");
        request.setPrioridade("MEDIA");
        request.setStatus("PENDENTE");
        request.setDataVencimento(LocalDate.now().plusDays(5));

        when(usuarioRepository.getReferenceById(1L)).thenReturn(usuario);
        when(tarefaRepository.save(any(Tarefa.class))).thenAnswer(invocation -> {
            Tarefa t = invocation.getArgument(0);
            t.setId(2L);
            t.setUser(usuario);
            return t;
        });
        doNothing().when(notificacaoService).criarNotificacao(anyLong(), anyString(), anyString(), anyString());

        TarefaResponse result = tarefaService.create(request, 1L);

        assertNotNull(result);
        assertEquals("Nova tarefa", result.getTitulo());
        verify(tarefaRepository).save(any(Tarefa.class));
    }

    @Test
    void create_WithCultura_Success() {
        TarefaRequest request = new TarefaRequest();
        request.setTitulo("Nova tarefa");
        request.setDataVencimento(LocalDate.now().plusDays(5));
        request.setCulturaId(1L);

        when(usuarioRepository.getReferenceById(1L)).thenReturn(usuario);
        when(culturaRepository.findById(1L)).thenReturn(Optional.of(cultura));
        when(tarefaRepository.save(any(Tarefa.class))).thenAnswer(invocation -> {
            Tarefa t = invocation.getArgument(0);
            t.setId(2L);
            t.setUser(usuario);
            return t;
        });
        doNothing().when(notificacaoService).criarNotificacao(anyLong(), anyString(), anyString(), anyString());

        TarefaResponse result = tarefaService.create(request, 1L);

        assertNotNull(result);
        verify(culturaRepository).findById(1L);
    }

    @Test
    void delete_Success() {
        when(tarefaRepository.findById(1L)).thenReturn(Optional.of(tarefa));

        tarefaService.delete(1L, 1L);

        verify(tarefaRepository).delete(tarefa);
    }

    @Test
    void delete_NotFound_ThrowsException() {
        when(tarefaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tarefaService.delete(1L, 1L));
    }
}
