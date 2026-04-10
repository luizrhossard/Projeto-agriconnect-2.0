package com.agricultura.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.agricultura.domain.StatusCultura;
import com.agricultura.domain.Usuario;
import com.agricultura.dto.CulturaRequest;
import com.agricultura.dto.CulturaResponse;
import com.agricultura.security.JwtAuthenticationFilter;
import com.agricultura.security.JwtService;
import com.agricultura.service.AuthService;
import com.agricultura.service.CulturaService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(CulturaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(JwtAuthenticationFilter.class)
class CulturaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CulturaService culturaService;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private com.agricultura.domain.Usuario usuario;

    private Usuario usuarioEntity;
    private CulturaResponse culturaResponse;

    @BeforeEach
    void setUp() {
        usuarioEntity = Usuario.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        culturaResponse = CulturaResponse.builder()
                .id(1L)
                .nome("Milho")
                .area(new BigDecimal("10.5"))
                .status(StatusCultura.PLANTADO)
                .dataPlantio(LocalDate.now())
                .userId(1L)
                .build();
    }

    @Test
    void findAll_Success() throws Exception {
        when(culturaService.findAll(1L)).thenReturn(List.of(culturaResponse));

        when(authService.getCurrentUser()).thenReturn(usuarioEntity);

        mockMvc.perform(get("/api/culturas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Milho"));
    }

    @Test
    void findById_Success() throws Exception {
        when(culturaService.findById(1L, 1L)).thenReturn(culturaResponse);

        when(authService.getCurrentUser()).thenReturn(usuarioEntity);

        mockMvc.perform(get("/api/culturas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Milho"));
    }

    @Test
    void create_Success() throws Exception {
        CulturaRequest request = new CulturaRequest();
        request.setNome("Soja");
        request.setArea(20.0);
        request.setDataPlantio(LocalDate.now());

        when(culturaService.create(any(CulturaRequest.class), eq(1L))).thenReturn(culturaResponse);

        when(authService.getCurrentUser()).thenReturn(usuarioEntity);

        mockMvc.perform(post("/api/culturas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void update_Success() throws Exception {
        CulturaRequest request = new CulturaRequest();
        request.setNome("Milho Atualizado");
        request.setArea(15.0);
        request.setDataPlantio(LocalDate.now());

        when(culturaService.update(eq(1L), any(CulturaRequest.class), eq(1L))).thenReturn(culturaResponse);

        when(authService.getCurrentUser()).thenReturn(usuarioEntity);

        mockMvc.perform(put("/api/culturas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void delete_Success() throws Exception {
        when(authService.getCurrentUser()).thenReturn(usuarioEntity);

        mockMvc.perform(delete("/api/culturas/1")).andExpect(status().isNoContent());
    }
}
