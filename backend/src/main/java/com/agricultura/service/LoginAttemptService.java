package com.agricultura.service;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_MINUTES = 30;
    private static final String ATTEMPTS_KEY_PREFIX = "auth:attempts:";
    private static final String LOCK_KEY_PREFIX = "auth:lock:";

    private final StringRedisTemplate redisTemplate;

    public void loginSucceeded(String email) {
        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        String lockKey = LOCK_KEY_PREFIX + email;
        redisTemplate.delete(attemptsKey);
        redisTemplate.delete(lockKey);
    }

    public void loginFailed(String email) {
        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        String lockKey = LOCK_KEY_PREFIX + email;

        Long attempts = redisTemplate.increment(attemptsKey);
        redisTemplate.expire(attemptsKey, LOCK_TIME_MINUTES, TimeUnit.MINUTES);

        if (attempts != null && attempts >= MAX_ATTEMPTS) {
            redisTemplate.opsForValue().setIfAbsent(lockKey, String.valueOf(System.currentTimeMillis()));
            redisTemplate.expire(lockKey, LOCK_TIME_MINUTES, TimeUnit.MINUTES);
            log.warn("Account locked for {} due to {} failed attempts", email, attempts);
        }
    }

    public boolean isBlocked(String email) {
        String lockKey = LOCK_KEY_PREFIX + email;
        String lockTimeStr = redisTemplate.opsForValue().get(lockKey);
        if (lockTimeStr == null) {
            return false;
        }
        return true;
    }

    public long getRemainingLockMinutes(String email) {
        String lockKey = LOCK_KEY_PREFIX + email;
        Long ttl = redisTemplate.getExpire(lockKey, TimeUnit.MINUTES);
        if (ttl == null || ttl < 0) {
            return 0;
        }
        return ttl;
    }
}
