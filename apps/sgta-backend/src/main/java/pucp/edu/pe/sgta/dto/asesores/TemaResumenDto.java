package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TemaResumenDto {
    private Integer id;
    private String titulo;
    private String areas;
    private String estadoTema;

    public TemaResumenDto() {}

    public TemaResumenDto(Integer id, String titulo, String areas, String estadoTema) {
        this.id = id;
        this.titulo = titulo;
        this.areas = areas;
        this.estadoTema = estadoTema;
    }
}