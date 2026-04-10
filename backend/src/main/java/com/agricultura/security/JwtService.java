package com.agricultura.security;

import com.agricultura.domain.Usuario;
import com.agricultura.repository.UsuarioRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtService implements UserDetailsService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    @Value("${app.jwt.issuer:agricultura-api}")
    private String jwtIssuer;

    private final UsuarioRepository usuarioRepository;

    public JwtService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public String generateToken(Usuario usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", usuario.getRole());
        claims.put("userId", usuario.getId());
        return generateToken(claims, usuario);
    }

    public String generateToken(Map<String, Object> extraClaims, Usuario usuario) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(usuario.getEmail())
                .issuer(jwtIssuer)
                .audience().add("agricultura-app").and()
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .requireIssuer(jwtIssuer)
                .requireAudience("agricultura-app")
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = decodeJwtSecret(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] decodeJwtSecret(String secret) {
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length < 32) {
                throw new IllegalArgumentException(
                    "JWT secret must be at least 256 bits (32 bytes) when base64 decoded, got " + decoded.length + " bytes");
            }
            return decoded;
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException(
                "JWT secret must be a valid Base64-encoded string with at least 256 bits. " +
                "Generate one with: openssl rand -base64 32", ex);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository
                .findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return new CustomUserDetails(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getRole());
    }
}
