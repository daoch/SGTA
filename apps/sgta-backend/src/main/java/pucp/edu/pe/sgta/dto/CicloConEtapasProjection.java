package pucp.edu.pe.sgta.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public interface CicloConEtapasProjection {
    Integer getCiclo_id();

    String getSemestre();

    Integer getAnio();

    LocalDate getFecha_inicio();

    LocalDate getFecha_fin();

    Boolean getActivo();

    Instant getFecha_creacion();

    Instant getFecha_modificacion();

    List<String> getEtapas_formativas();

    Integer getCantidad_etapas();
}
