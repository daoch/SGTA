package pucp.edu.pe.sgta;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SgtaApplication {

	public static void main(String[] args) {

		//ESTO SE USARA CUANDO SE TENGA LA BASE DE DATOS
		/*Dotenv dotenv = Dotenv.load();

		//Obetener las variables de entorno
		String dbUrl = dotenv.get("DB_URL");
		String dbUser = dotenv.get("DB_USER");
		String dbPass = dotenv.get("DB_PASS");

		//Establecer las variables en el sistemas
		System.setProperty("DB_URL", dbUrl);
		System.setProperty("DB_USER", dbUser);
		System.setProperty("DB_PASS", dbPass);*/
		SpringApplication.run(SgtaApplication.class, args);
	}

}
