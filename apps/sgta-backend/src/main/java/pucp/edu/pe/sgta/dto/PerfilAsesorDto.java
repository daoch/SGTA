package pucp.edu.pe.sgta.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PerfilAsesorDto {
    private String nivelEstudios;
    private String nombres;
    private String apellido;
    private String correo;
    private String enlace_linkedin;
    private String enlace_repositorio;
    private String biografia;
    //Se obtiene de otros querys
    private Integer tesistasActuales;
    private Integer tesistasMaximos;
    private List<InfoAreaConocimiento> areaConocimientos;
    private List<InfoSubAreaConocimientoDto> subAreaConocimientos;
    //Resultado de calculo
    private String estado;

    public void actualizarEstado(){
        if(tesistasActuales == null || tesistasMaximos == null){
            return;
        }
        if(tesistasActuales >= tesistasMaximos){
            estado = "No Disponible";
        }
        if(tesistasActuales < tesistasMaximos){
            estado = "Disponible";
        }
    }
}
