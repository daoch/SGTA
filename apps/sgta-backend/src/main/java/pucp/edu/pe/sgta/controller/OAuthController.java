package pucp.edu.pe.sgta.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import pucp.edu.pe.sgta.dto.GoogleResponse.GoogleTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController

public class OAuthController {
    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;

    @Value("${google.token.uri}")
    private String tokenUri;

    @Value("${redirect.back}")
    private String redirectBack;
    private final UsuarioService usuarioService;

    private final UsuarioRepository usuarioRepository;

    public OAuthController(UsuarioService usuarioService, JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;

        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    @GetMapping("/oauth2/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code,@RequestParam(value = "state", required = false) String state, HttpServletRequest requ) {
        RestTemplate restTemplate = new RestTemplate();

        // Formulario de parámetros
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<GoogleTokenResponse> response = restTemplate.exchange(
                    tokenUri,
                    HttpMethod.POST,
                    request,
                    GoogleTokenResponse.class
            );
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> stateData = mapper.readValue(
                    URLDecoder.decode(state, StandardCharsets.UTF_8),
                    Map.class
            );


            String idCognito = stateData.get("cognitoId");
            DecodedJWT jwt = JWT.decode(idCognito);
            String cognitoSub = jwt.getSubject();
            Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();


            GoogleTokenResponse token = response.getBody();

            usuarioRepository.setRefreshToken(usuarioId,token.getRefreshToken());

            HttpSession session = requ.getSession(true);
            System.out.println("Guardando token en sesión: " + session.getId());
            session.setAttribute("googleAccessToken", token.getAccessToken());



            String path = stateData.getOrDefault("path", "/dashboard");


            String frontendBase = redirectBack;
            URI redirectUri = URI.create(frontendBase + path);



            return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();

        } catch (Exception e) {
            System.err.println("Error desde PostgreSQL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener token: " + e.getMessage());
        }
    }
}
