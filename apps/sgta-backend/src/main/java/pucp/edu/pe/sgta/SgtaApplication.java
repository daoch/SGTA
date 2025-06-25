package pucp.edu.pe.sgta;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@EnableAspectJAutoProxy
@SpringBootApplication
@EnableJpaRepositories(basePackages = "pucp.edu.pe.sgta.repository")
@EnableScheduling
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
		System.setProperty("AWS_CLOUDFRONT_PUBLIC_KEY_ID", dotenv.get("AWS_CLOUDFRONT_PUBLIC_KEY_ID", ""));
		System.setProperty("AWS_BASE_CLOUDFRONT_URL", dotenv.get("AWS_BASE_CLOUDFRONT_URL", ""));

		System.setProperty("ZOOM_ACCOUNT_ID", dotenv.get("ZOOM_ACCOUNT_ID", ""));
		System.setProperty("ZOOM_CLIENT_SECRET", dotenv.get("ZOOM_CLIENT_SECRET", ""));
		System.setProperty("ZOOM_CLIENT_ID", dotenv.get("ZOOM_CLIENT_ID", ""));
		System.setProperty("ZOOM_POST_ACCESS_TOKEN_URL", dotenv.get("ZOOM_POST_ACCESS_TOKEN_URL", ""));
		System.setProperty("ZOOM_MEETING_CREATION_URL", dotenv.get("ZOOM_MEETING_CREATION_URL", ""));

		System.setProperty("GOOGLE_CLIENT_ID",dotenv.get("GOOGLE_CLIENT_ID", ""));
		System.setProperty("GOOGLE_CLIENT_SECRET",dotenv.get("GOOGLE_CLIENT_SECRET", ""));
		System.setProperty("GOOGLE_PROJECT_ID",dotenv.get("GOOGLE_PROJECT_ID", ""));
		System.setProperty("GOOGLE_REDIRECT_URI",dotenv.get("GOOGLE_REDIRECT_URI", ""));
		System.setProperty("GOOGLE_AUTH_URI",dotenv.get("GOOGLE_AUTH_URI", ""));
		System.setProperty("GOOGLE_TOKEN_URI",dotenv.get("GOOGLE_TOKEN_URI", ""));
		System.setProperty("GOOGLE_SCOPE",dotenv.get("GOOGLE_SCOPE", ""));

		System.setProperty("REDIRECT_BACK",dotenv.get("REDIRECT_BACK", ""));
		System.setProperty("URL_BACK",dotenv.get("URL_BACK", ""));
	}

	public static void main(String[] args) {
		SpringApplication.run(SgtaApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}