package com.agricultura.service;

import com.agricultura.exception.BusinessException;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

    private final ConcurrentHashMap<String, Integer> attemptCache = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_MINUTES = 30;
    private final ConcurrentHashMap<String, Long> lockCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String email) {
        attemptCache.remove(email);
        lockCache.remove(email);
    }

    public void loginFailed(String email) {
        int attempts = attemptCache.merge(email, 1, Integer::sum);
        if (attempts >= MAX_ATTEMPTS) {
            lockCache.put(email, System.currentTimeMillis());
        }
    }

    public boolean isBlocked(String email) {
        Long lockTime = lockCache.get(email);
        if (lockTime == null) {
            return false;
        }
        long elapsedMinutes = (System.currentTimeMillis() - lockTime) / 60000;
        if (elapsedMinutes >= LOCK_TIME_MINUTES) {
            lockCache.remove(email);
            attemptCache.remove(email);
            return false;
        }
        return true;
    }

    public long getRemainingLockMinutes(String email) {
        Long lockTime = lockCache.get(email);
        if (lockTime == null) {
            return 0;
        }
        long elapsedMinutes = (System.currentTimeMillis() - lockTime) / 60000;
        return Math.max(0, LOCK_TIME_MINUTES - elapsedMinutes);
    }
}
