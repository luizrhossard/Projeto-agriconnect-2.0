package com.agricultura.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import com.agricultura.domain.Cultura;
import com.agricultura.domain.StatusCultura;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.CulturaRequest;
import com.agricultura.dto.CulturaResponse;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.repository.CulturaRepository;
import com.agricultura.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class CulturaServiceTest {

    @Mock
    private CulturaRepository culturaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private CulturaService culturaService;

    private Usuario usuario;
    private Cultura cultura;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        cultura = Cultura.builder()
                .id(1L)
                .nome("Milho")
                .area(new BigDecimal("10.5"))
                .status(StatusCultura.PLANTADO)
                .dataPlantio(LocalDate.now())
                .user(usuario)
                .build();
    }

    @Test
    void findAll_ReturnsCulturas() {
        when(culturaRepository.findByUserId(1L)).thenReturn(List.of(cultura));

        List<CulturaResponse> result = culturaService.findAll(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Milho", result.get(0).getNome());
    }

    @Test
    void findById_Success() {
        when(culturaRepository.findById(1L)).thenReturn(Optional.of(cultura));

        CulturaResponse result = culturaService.findById(1L, 1L);

        assertNotNull(result);
        assertEquals("Milho", result.getNome());
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(culturaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> culturaService.findById(1L, 1L));
    }

    @Test
    void findById_AccessDenied_ThrowsException() {
        when(culturaRepository.findById(1L)).thenReturn(Optional.of(cultura));

        assertThrows(AccessDeniedException.class, () -> culturaService.findById(1L, 999L));
    }

    @Test
    void create_Success() {
        CulturaRequest request = new CulturaRequest();
        request.setNome("Soja");
        request.setArea(20.0);
        request.setDataPlantio(LocalDate.now());

        when(usuarioRepository.getReferenceById(1L)).thenReturn(usuario);
        when(culturaRepository.save(any(Cultura.class))).thenAnswer(invocation -> {
            Cultura c = invocation.getArgument(0);
            c.setId(2L);
            return c;
        });

        CulturaResponse result = culturaService.create(request, 1L);

        assertNotNull(result);
        assertEquals("Soja", result.getNome());
        verify(culturaRepository).save(any(Cultura.class));
    }

    @Test
    void create_UserNotFound_ThrowsException() {
        CulturaRequest request = new CulturaRequest();
        request.setNome("Soja");
        request.setArea(20.0);
        request.setDataPlantio(LocalDate.now());

        when(usuarioRepository.getReferenceById(1L))
                .thenThrow(new jakarta.persistence.EntityNotFoundException("Usuário não encontrado"));

        assertThrows(jakarta.persistence.EntityNotFoundException.class, () -> culturaService.create(request, 1L));
    }
}
