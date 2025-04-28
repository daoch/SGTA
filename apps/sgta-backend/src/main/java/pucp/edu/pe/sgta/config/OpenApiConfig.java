package pucp.edu.pe.sgta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
			.info(new io.swagger.v3.oas.models.info.Info().title("SGTA API - Sistema de Gestión de Tesis PUCP")
				.description("Documentación OpenAPI para el backend del sistema SGTA.")
				.version("v1.0"));
	}

}
