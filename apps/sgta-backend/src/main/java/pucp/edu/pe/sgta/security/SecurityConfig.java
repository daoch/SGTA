package pucp.edu.pe.sgta.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${cognito.region}")
    private String region;

    @Value("${cognito.userPoolId}")
    private String userPoolId;

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // ── Autorización ────────────────────────────────────────────────
        if ("dev".equals(activeProfile)) {
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        } else {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html")
                    .permitAll()
                    .anyRequest().authenticated());
        }

        // ── ¡Siempre! registrar el resource server ─────────────────────
        http.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder())));

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        String issuer = String.format(
                "https://cognito-idp.%s.amazonaws.com/%s",
                region, userPoolId);
        return JwtDecoders.fromIssuerLocation(issuer);
    }
}
