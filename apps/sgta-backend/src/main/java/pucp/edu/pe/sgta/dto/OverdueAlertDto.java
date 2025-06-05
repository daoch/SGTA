package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverdueAlertDto {
    private int total;
    private List<String> mensajes;
    private List<EntregableVencidoDto> entregablesVencidos;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EntregableVencidoDto {
        private Integer entregableId;
        private String nombreEntregable;
        private String fechaVencimiento;
        private Integer diasAtraso;
        private String nombreTema;
        private Integer temaId;
    }
} 