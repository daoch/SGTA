package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

    @Setter
    @Getter
    public class FiltrosDirectorioAsesores {
        @NotNull
        private Integer alumnoId;
        @NotNull
        private String cadenaBusqueda;
        @NotNull
        private Boolean activo;
        private List<Integer> idAreas = new ArrayList<>();
        private List<Integer> idTemas = new ArrayList<>();
    }
