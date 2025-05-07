package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EtapaFormativaDTO {

    private Integer id;

    private String nombre;

    private Integer creditajePorTema;

    private Integer duracionExposicion;

    private boolean activo;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaModificacion;
}
