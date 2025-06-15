package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;
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
        String bio = (String) result[5];
        dto.biografia = bio==null?"":bio;
        byte[] foto = (byte[]) result[6];
        dto.foto = Utils.convertByteArrayToStringBase64(foto);
        dto.limiteTesis = Integer.parseInt(result[7].toString());
        return dto;
    }

    public static PerfilAsesorDto fromPerfilUsuario(PerfilUsuarioDto dto) {
        PerfilAsesorDto dto2 = new PerfilAsesorDto();
        dto2.id = dto.getId();
        dto2.nombre = dto.getNombre();
        dto2.especialidad = dto.getEspecialidad();
        dto2.email = dto.getEmail();
        dto2.linkedin = dto.getLinkedin();
        dto2.repositorio = dto.getRepositorio();
        dto2.biografia = dto.getBiografia();
        dto2.foto = dto.getFoto();
        dto2.estado = dto.getEstado();
        dto2.limiteTesis = dto.getLimiteTesis();
        dto2.tesistasActuales = dto.getTesistasActuales();
        dto2.areasTematicas = dto.getAreasTematicas();
        dto2.temasIntereses = dto.getTemasIntereses();
        return dto2;
    }
}
