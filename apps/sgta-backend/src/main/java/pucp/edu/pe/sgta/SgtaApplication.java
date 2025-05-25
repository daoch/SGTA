package pucp.edu.pe.sgta;

import io.github.cdimascio.dotenv.Dotenv;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "pucp.edu.pe.sgta.repository")
public class SgtaApplication {


	static {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		System.setProperty("DB_URL", dotenv.get("DB_URL", ""));
		System.setProperty("DB_USER", dotenv.get("DB_USER", ""));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD", ""));
		System.setProperty("CORS_ALLOWED_ORIGIN", dotenv.get("CORS_ALLOWED_ORIGIN", ""));
		System.setProperty("AWS_S3_BUCKET", dotenv.get("AWS_S3_BUCKET", ""));
		System.setProperty("AWS_ACCESS_KEY_ID", dotenv.get("AWS_ACCESS_KEY_ID", ""));
		System.setProperty("AWS_SECRET_ACCESS_KEY", dotenv.get("AWS_SECRET_ACCESS_KEY", ""));
		System.setProperty("AWS_REGION", dotenv.get("AWS_REGION", ""));
	}

	public static void main(String[] args) {
		
		SpringApplication.run(SgtaApplication.class, args);


	}
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}