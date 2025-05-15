package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import jakarta.persistence.Convert;
import jakarta.persistence.Converter;
import jakarta.persistence.AttributeConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etapa_formativa")
public class EtapaFormativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "etapa_formativa_id")
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nombre;

    @Column(name = "creditaje_por_tema", nullable = true, precision = 6, scale = 2)
    private BigDecimal creditajePorTema;

    @Transient
    private Duration duracionExposicion;

    @Column(name = "duracion_exposicion", columnDefinition = "interval", insertable = false, updatable = false)
    private String duracionExposicionStr;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(
        name = "fecha_creacion",
        nullable = false,
        updatable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(
        name = "fecha_modificacion",
        nullable = false,
        insertable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime fechaModificacion;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "carrera_id", nullable = false, foreignKey = @ForeignKey(name = "fk_area_conocimiento_carrera"))
    private Carrera carrera;

    /**
     * Converter para transformar Duration a PostgreSQL interval
     */
    @Converter
    public static class DurationToIntervalConverter implements AttributeConverter<Duration, String> {

        @Override
        public String convertToDatabaseColumn(Duration attribute) {
            if (attribute == null) {
                return null;
            }

            try {
                long seconds = attribute.getSeconds();
                int nanos = attribute.getNano();

                long days = seconds / 86400;
                seconds %= 86400;
                long hours = seconds / 3600;
                seconds %= 3600;
                long minutes = seconds / 60;
                seconds %= 60;

                StringBuilder sb = new StringBuilder();

                if (days > 0) {
                    sb.append(days).append(" days ");
                }

                sb.append(String.format("%02d:%02d:%02d", hours, minutes, seconds));

                if (nanos > 0) {
                    sb.append(".").append(String.format("%09d", nanos).substring(0, 6));
                }

                return sb.toString();
            } catch (Exception e) {
                // En caso de cualquier error, retornar null
                return null;
            }
        }

        @Override
        public Duration convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isEmpty()) {
                return null;
            }

            try {
                // Parse PostgreSQL interval format into components
                String[] parts = dbData.split(":");
                if (parts.length < 3) {
                    return null;
                }

                // Extract hours, minutes, seconds
                int hours = Integer.parseInt(parts[0]);
                int minutes = Integer.parseInt(parts[1]);

                // Handle seconds which might contain decimal part
                float seconds = Float.parseFloat(parts[2]);

                // Convert all to seconds
                long totalSeconds = hours * 3600 + minutes * 60 + (long)seconds;

                // Convert to Duration
                return Duration.ofSeconds(totalSeconds);
            } catch (Exception e) {
                // If parsing fails, return null
                return null;
            }
        }
    }
}