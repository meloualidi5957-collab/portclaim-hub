package com.portclaim.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.expiration}") private long expiration;

    private SecretKey key() { return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)); }

    public String generateToken(String email, Map<String, Object> claims) {
        return Jwts.builder().claims(claims).subject(email)
            .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(key()).compact();
    }
    public String extractEmail(String t) { return extract(t, Claims::getSubject); }
    public <T> T extract(String t, Function<Claims, T> f) { return f.apply(Jwts.parser().verifyWith(key()).build().parseSignedClaims(t).getPayload()); }
    public boolean isValid(String t) {
        try { return extract(t, Claims::getExpiration).after(new Date()); } catch (Exception e) { return false; }
    }
}
