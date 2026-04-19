package com.agricultura.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RateLimitServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RateLimitService rateLimitService;

    private static final String CLIENT_ID = "192.168.1.1";
    private static final String ENDPOINT = "/api/culturas";

    @BeforeEach
    void setUp() {
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        ReflectionTestUtils.setField(rateLimitService, "requestsPerMinute", 60);
        ReflectionTestUtils.setField(rateLimitService, "enabled", true);
    }

    @Test
    void isAllowed_FirstRequest_ReturnsTrue() {
        when(valueOperations.increment("ratelimit:/api/culturas:192.168.1.1", 1L))
                .thenReturn(1L);

        assertTrue(rateLimitService.isAllowed(CLIENT_ID, ENDPOINT));
        verify(redisTemplate).expire("ratelimit:/api/culturas:192.168.1.1", 1, TimeUnit.MINUTES);
    }

    @Test
    void isAllowed_UnderLimit_ReturnsTrue() {
        when(valueOperations.increment("ratelimit:/api/culturas:192.168.1.1", 1L))
                .thenReturn(30L);

        assertTrue(rateLimitService.isAllowed(CLIENT_ID, ENDPOINT));
    }

    @Test
    void isAllowed_AtLimit_ReturnsTrue() {
        when(valueOperations.increment("ratelimit:/api/culturas:192.168.1.1", 1L))
                .thenReturn(60L);

        assertTrue(rateLimitService.isAllowed(CLIENT_ID, ENDPOINT));
    }

    @Test
    void isAllowed_OverLimit_ReturnsFalse() {
        when(valueOperations.increment("ratelimit:/api/culturas:192.168.1.1", 1L))
                .thenReturn(61L);

        assertFalse(rateLimitService.isAllowed(CLIENT_ID, ENDPOINT));
    }

    @Test
    void isAllowed_Disabled_ReturnsTrue() {
        ReflectionTestUtils.setField(rateLimitService, "enabled", false);

        assertTrue(rateLimitService.isAllowed(CLIENT_ID, ENDPOINT));
        verify(valueOperations, never()).increment(anyString(), anyLong());
    }

    @Test
    void getRemainingRequests_NoKey_ReturnsMax() {
        when(valueOperations.get("ratelimit:/api/culturas:192.168.1.1")).thenReturn(null);

        assertEquals(60, rateLimitService.getRemainingRequests(CLIENT_ID, ENDPOINT));
    }

    @Test
    void getRemainingRequests_WithUsage_ReturnsRemaining() {
        when(valueOperations.get("ratelimit:/api/culturas:192.168.1.1")).thenReturn("10");

        assertEquals(50, rateLimitService.getRemainingRequests(CLIENT_ID, ENDPOINT));
    }

    @Test
    void getRemainingRequests_Exceeded_ReturnsZero() {
        when(valueOperations.get("ratelimit:/api/culturas:192.168.1.1")).thenReturn("65");

        assertEquals(0, rateLimitService.getRemainingRequests(CLIENT_ID, ENDPOINT));
    }

    @Test
    void getRetryAfterSeconds_WithTTL_ReturnsTTL() {
        when(redisTemplate.getExpire(anyString(), eq(TimeUnit.SECONDS))).thenReturn(45L);

        assertEquals(45, rateLimitService.getRetryAfterSeconds(CLIENT_ID, ENDPOINT));
    }

    @Test
    void getRetryAfterSeconds_NoTTL_ReturnsDefault() {
        when(redisTemplate.getExpire(anyString(), eq(TimeUnit.SECONDS))).thenReturn(-1L);

        assertEquals(60, rateLimitService.getRetryAfterSeconds(CLIENT_ID, ENDPOINT));
    }
}
