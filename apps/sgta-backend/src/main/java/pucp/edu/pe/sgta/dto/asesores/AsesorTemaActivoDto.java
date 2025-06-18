package pucp.edu.pe.sgta.dto.asesores;

public class AsesorTemaActivoDto {
    private Integer temaId;
    private String temaTitulo;
    // Opcional: Podrías añadir más información si es útil para el selector en el frontend
    // private String temaCodigo;
    private Integer cantidadEstudiantes;

    public AsesorTemaActivoDto(Integer temaId, String temaTitulo) {
        this.temaId = temaId;
        this.temaTitulo = temaTitulo;
    }

    // Getters y Setters
    public Integer getTemaId() { return temaId; }
    public void setTemaId(Integer temaId) { this.temaId = temaId; }
    public String getTemaTitulo() { return temaTitulo; }
    public void setTemaTitulo(String temaTitulo) { this.temaTitulo = temaTitulo; }
}
