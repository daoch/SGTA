package pucp.edu.pe.sgta.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Bean
    public CommandLineRunner fixEtapaFormativaColumn() {
        return args -> {
            try {
                System.out.println("Converting duracion_exposicion column to INTERVAL type...");
                jdbcTemplate.execute(
                    "ALTER TABLE etapa_formativa " +
                    "ALTER COLUMN duracion_exposicion TYPE interval " +
                    "USING duracion_exposicion::interval"
                );
                System.out.println("Column conversion completed successfully");
            } catch (Exception e) {
                System.out.println("Column conversion error or already migrated: " + e.getMessage());
                // Continue if already migrated or other error
            }
        };
    }
} 