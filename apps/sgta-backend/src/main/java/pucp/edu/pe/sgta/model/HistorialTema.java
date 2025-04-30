package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "historial_tema")
public class HistorialTema {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Tema tema;

    private String titulo;
    private String resumen;
    private LocalDateTime fechaRegistro;
    private boolean estado;
    private boolean activo;
    private String descripcionCambio;
}
