package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.util.Base64;
import java.util.List;

@Getter
@Setter
public class PerfilAsesorDto {
    private Integer id;
    private String nombre;// El primer nombre y apellido Paterno
    private String especialidad;// Obtener usuarioXCarrera
    private String email;
    private String linkedin;
    private String repositorio;
    private String biografia;
    private String foto;
    private Boolean estado;// La clase lo calcula
    private Integer limiteTesis;// Obtener de configuracion
    private Integer tesistasActuales;// Consultar temas
    private List<InfoAreaConocimientoDto> areasTematicas;// Hallar de las tablas correspondientes
    private List<InfoSubAreaConocimientoDto> temasIntereses;// Hallar de las tablas correspondientes
    // Resultado de calculo

    public void actualizarEstado() {
        if (tesistasActuales == null || limiteTesis == null) {
            return;
        }
        estado = (tesistasActuales < limiteTesis);
    }

    public static PerfilAsesorDto fromQueryDirectorioAsesores(Object[] result) {
        PerfilAsesorDto dto = new PerfilAsesorDto();
        dto.id = Integer.parseInt(result[0].toString());
        dto.nombre = result[1].toString() + " " + result[2].toString();
        dto.especialidad = result[3].toString();
        dto.email = result[4].toString();
        dto.linkedin = null;
        dto.repositorio = null;
        dto.biografia = result[5].toString();
        byte[] foto = (byte[]) result[6];
        dto.foto = Utils.convertByteArrayToStringBase64(foto);
        dto.limiteTesis = Integer.parseInt(result[7].toString());
        return dto;
    }
}
