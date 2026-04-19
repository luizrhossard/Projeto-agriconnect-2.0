package com.agricultura.security;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.agricultura.service.RateLimitService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RateLimitFilterTest {

    @Mock
    private RateLimitService rateLimitService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private RateLimitFilter rateLimitFilter;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(rateLimitFilter, "enabled", true);
    }

    @Test
    void doFilter_Disabled_PassesThrough() throws Exception {
        ReflectionTestUtils.setField(rateLimitFilter, "enabled", false);
        when(request.getRequestURI()).thenReturn("/api/culturas");

        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(rateLimitService, never()).isAllowed(anyString(), anyString());
    }

    @Test
    void doFilter_AuthEndpoint_PassesThrough() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/auth/login");

        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(rateLimitService, never()).isAllowed(anyString(), anyString());
    }

    @Test
    void doFilter_Allowed_PassesThrough() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/culturas");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(rateLimitService.isAllowed("192.168.1.1", "/api/culturas")).thenReturn(true);

        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilter_RateLimitExceeded_Returns429() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/culturas");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(rateLimitService.isAllowed("192.168.1.1", "/api/culturas")).thenReturn(false);
        when(rateLimitService.getRetryAfterSeconds("192.168.1.1", "/api/culturas"))
                .thenReturn(45L);
        StringWriter sw = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(sw));

        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        verify(response).setHeader("Retry-After", "45");
        verify(filterChain, never()).doFilter(request, response);
    }

    @Test
    void doFilter_XForwardedFor_UsesFirstIp() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/culturas");
        when(request.getHeader("X-Forwarded-For")).thenReturn("10.0.0.1, 10.0.0.2");
        when(rateLimitService.isAllowed("10.0.0.1", "/api/culturas")).thenReturn(true);

        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(rateLimitService).isAllowed("10.0.0.1", "/api/culturas");
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilter_AuthRegisterEndpoint_PassesThrough() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/auth/register");

        rateLimitFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(rateLimitService, never()).isAllowed(anyString(), anyString());
    }
}
