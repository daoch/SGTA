package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.util.Arrays;
import java.util.List;

@Getter
@Setter
public class PerfilUsuarioDto {
    private Integer id;
    private String nombre;
    private String especialidad;//Viene en lista
    private String email;
    private String linkedin;
    private String repositorio;
    private String biografia;
    private String foto;
    private Integer limiteTesis;//Viene en lista
    private List<EnlaceUsuarioDto> enlaces;//Se obtiene aparte
    private Boolean estado; // la clase lo calcula
    private Integer tesistasActuales;// Este si o si es query diferente
    private List<InfoAreaConocimientoDto> areasTematicas;// Hallar de las tablas correspondientes
    private List<InfoSubAreaConocimientoDto> temasIntereses;// Hallar de las tablas correspondientes

    public static PerfilUsuarioDto fromMainQuery(Object[] result) {
        //Este obtiene los campos desde id hasta limite tesis
        PerfilUsuarioDto dto = new PerfilUsuarioDto();
        dto.id = (Integer) result[0];
        String nombreQuery = (String) result[1];
        String apellidoQuery = (String) result[2];
        dto.nombre = Utils.normalizarNombre(nombreQuery, apellidoQuery);
        dto.email = (String) result[3];
        dto.linkedin = (String) result[4];
        dto.repositorio = (String) result[5];
        dto.biografia = (String) result[6];
        byte[] fotoQuery =  (byte[]) result[7];
        dto.foto = Utils.convertByteArrayToStringBase64(fotoQuery);
        //Mantenemos los arrays obtenidos
        //Integer[] arrayIdCarrera = (Integer[]) result[8];
        String[] arrayNombreCarrera = (String[]) result[9];
        Integer[] arrayLimiteCarrera = (Integer[]) result[10];
        //Los pasamos a listas
        //List<Integer> listaIdCarrera = Arrays.stream(arrayIdCarrera).toList();
        List<String> listaNombreCarrera = Arrays.stream(arrayNombreCarrera).toList();
        List<Integer> listaLimiteCarrera = Arrays.stream(arrayLimiteCarrera).toList();
        //Por ahora las listas no se usan por lo que solo nos quedamos con el primero valor
        dto.especialidad = listaNombreCarrera.get(0);
        dto.limiteTesis = listaLimiteCarrera.get(0);
        return dto;
    }
    public Boolean getEstado(){
        if (tesistasActuales == null || limiteTesis == null) {
            return null;
        }
        return (tesistasActuales < limiteTesis);
    }
}
