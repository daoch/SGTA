package pucp.edu.pe.sgta.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowedOrigin}")
	private String allowedOrigin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(allowedOrigin)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}