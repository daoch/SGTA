package pucp.edu.pe.sgta.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistorialReunionDTO {
    private LocalDate fecha;
    private String duracion;
    private String notas;
} 