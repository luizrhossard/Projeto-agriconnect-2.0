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

@ExtendWith(MockitoExtension.class)
class LoginAttemptServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private LoginAttemptService loginAttemptService;

    private static final String EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void loginSucceeded_DeletesKeys() {
        loginAttemptService.loginSucceeded(EMAIL);

        verify(redisTemplate).delete("auth:attempts:" + EMAIL);
        verify(redisTemplate).delete("auth:lock:" + EMAIL);
    }

    @Test
    void loginFailed_FirstAttempt_IncrementsAndSetsExpiry() {
        when(redisTemplate.increment("auth:attempts:" + EMAIL)).thenReturn(1L);

        loginAttemptService.loginFailed(EMAIL);

        verify(redisTemplate).increment("auth:attempts:" + EMAIL);
        verify(redisTemplate).expire("auth:attempts:" + EMAIL, 30, TimeUnit.MINUTES);
        verify(redisTemplate, never()).opsForValue();
    }

    @Test
    void loginFailed_ExceedsMaxAttempts_LocksAccount() {
        when(redisTemplate.increment("auth:attempts:" + EMAIL)).thenReturn(5L);
        when(valueOperations.setIfAbsent(anyString(), anyString())).thenReturn(true);

        loginAttemptService.loginFailed(EMAIL);

        verify(valueOperations).setIfAbsent(eq("auth:lock:" + EMAIL), anyString());
        verify(redisTemplate).expire(eq("auth:lock:" + EMAIL), eq(30L), eq(TimeUnit.MINUTES));
    }

    @Test
    void loginFailed_BelowMaxAttempts_DoesNotLock() {
        when(redisTemplate.increment("auth:attempts:" + EMAIL)).thenReturn(3L);

        loginAttemptService.loginFailed(EMAIL);

        verify(valueOperations, never()).setIfAbsent(anyString(), anyString());
    }

    @Test
    void isBlocked_WhenLockExists_ReturnsTrue() {
        when(valueOperations.get("auth:lock:" + EMAIL)).thenReturn("1234567890");

        assertTrue(loginAttemptService.isBlocked(EMAIL));
    }

    @Test
    void isBlocked_WhenNoLockExists_ReturnsFalse() {
        when(valueOperations.get("auth:lock:" + EMAIL)).thenReturn(null);

        assertFalse(loginAttemptService.isBlocked(EMAIL));
    }

    @Test
    void getRemainingLockMinutes_WhenLockExists_ReturnsTTL() {
        when(redisTemplate.getExpire("auth:lock:" + EMAIL, TimeUnit.MINUTES)).thenReturn(25L);

        assertEquals(25L, loginAttemptService.getRemainingLockMinutes(EMAIL));
    }

    @Test
    void getRemainingLockMinutes_WhenNoLock_ReturnsZero() {
        when(redisTemplate.getExpire("auth:lock:" + EMAIL, TimeUnit.MINUTES)).thenReturn(-1L);

        assertEquals(0, loginAttemptService.getRemainingLockMinutes(EMAIL));
    }

    @Test
    void getRemainingLockMinutes_WhenTTLIsNull_ReturnsZero() {
        when(redisTemplate.getExpire("auth:lock:" + EMAIL, TimeUnit.MINUTES)).thenReturn(null);

        assertEquals(0, loginAttemptService.getRemainingLockMinutes(EMAIL));
    }
}
