package pucp.edu.pe.sgta.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PerfilAsesorDto {
    private Integer id;
    private String nombre;//El primer nombre y apellido Paterno
    private String especialidad;//Obtener usuarioXCarrera
    private String email;
    private String linkedin;
    private String repositorio;
    private String biografia;
    private Boolean estado;//La clase lo calcula
    private Integer limiteTesis;//Obtener de configuracion
    private Integer tesistasActuales;//Consultar temas
    private List<InfoAreaConocimientoDto> areasTematicas;//Hallar de las tablas correspondientes
    private List<InfoSubAreaConocimientoDto> temasIntereses;//Hallar de las tablas correspondientes
    //Resultado de calculo

    public void actualizarEstado(){
        if(tesistasActuales == null || limiteTesis == null){
            return;
        }
        estado = (tesistasActuales < limiteTesis);
    }
}
