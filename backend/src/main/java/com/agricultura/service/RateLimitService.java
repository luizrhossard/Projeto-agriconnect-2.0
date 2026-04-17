package com.agricultura.service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitService {

    private static final String RATE_LIMIT_KEY_PREFIX = "ratelimit:";

    private final StringRedisTemplate redisTemplate;

    @Value("${app.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    @Value("${app.rate-limit.enabled:true}")
    private boolean enabled;

    public boolean isAllowed(String clientId, String endpoint) {
        if (!enabled) {
            return true;
        }

        String key = RATE_LIMIT_KEY_PREFIX + endpoint + ":" + clientId;
        Long current = redisTemplate.opsForValue().increment(key);

        if (current != null && current == 1) {
            redisTemplate.expire(key, 1, TimeUnit.MINUTES);
        }

        if (current != null && current > requestsPerMinute) {
            log.debug("Rate limit exceeded for client {} on endpoint {}", clientId, endpoint);
            return false;
        }

        return true;
    }

    public long getRemainingRequests(String clientId, String endpoint) {
        String key = RATE_LIMIT_KEY_PREFIX + endpoint + ":" + clientId;
        String value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            return requestsPerMinute;
        }
        long used = Long.parseLong(value);
        return Math.max(0, requestsPerMinute - used);
    }

    public long getRetryAfterSeconds(String clientId, String endpoint) {
        String key = RATE_LIMIT_KEY_PREFIX + endpoint + ":" + endpoint;
        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        if (ttl == null || ttl < 0) {
            return 60;
        }
        return ttl;
    }
}