package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CriterioEntregableDto {
    private Integer id;
    private String nombre;
    private BigDecimal notaMaxima;
    private String descripcion;
    private Double nota; // este puede quedar null o asignarlo luego
    private Integer revision_documento_id; //nullable
    private Integer usuario_revisor_id; //nullable
    private Integer tema_x_entregable_id;//nullable
    private Integer entregable_id; //nullable
    private String entregable_descripcion; //nullable


    /** Este constructor de 4 argumentos es el que usará la consulta JPQL “new …” */
    public CriterioEntregableDto(Integer id,
                                 String nombre,
                                 BigDecimal notaMaxima,
                                 String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.notaMaxima = notaMaxima;
        this.descripcion = descripcion;
        // nota queda null hasta que tú la llenes manualmente después
    }

    /** Opcional: constructor completo */
    public CriterioEntregableDto(Integer id,
                                 String nombre,
                                 BigDecimal notaMaxima,
                                 String descripcion,
                                 Double nota) {
        this.id = id;
        this.nombre = nombre;
        this.notaMaxima = notaMaxima;
        this.descripcion = descripcion;
        this.nota = nota;
    }
}
