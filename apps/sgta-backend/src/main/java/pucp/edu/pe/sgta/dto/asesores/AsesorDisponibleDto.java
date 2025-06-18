package pucp.edu.pe.sgta.dto.asesores;

public class AsesorDisponibleDto {
    private Integer id;                 // ID del Usuario (profesor)
    private String nombres;
    private String primerApellido;
    private String segundoApellido;     // Opcional, o puedes concatenar apellidos
    private String correoElectronico;
    private String codigoPucp;          // Opcional
    private Integer cantidadTesistasActuales; // Carga actual
    // private Integer capacidadMaxima;       // Si tienes este dato
    // private List<AreaTematicaDto> areasTematicas; // Si quieres mostrar sus áreas
    private String urlFoto;             // O byte[]

    // Constructor para mapeo fácil desde el servicio
    public AsesorDisponibleDto(Integer id, String nombres, String primerApellido, String segundoApellido,
                               String correoElectronico, String codigoPucp,
                               Integer cantidadTesistasActuales, /* Integer capacidadMaxima, */ String urlFoto) {
        this.id = id;
        this.nombres = nombres;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.correoElectronico = correoElectronico;
        this.codigoPucp = codigoPucp;
        this.cantidadTesistasActuales = cantidadTesistasActuales;
        // this.capacidadMaxima = capacidadMaxima;
        // this.areasTematicas = areasTematicas;
        this.urlFoto = urlFoto;
    }

    // Getters y Setters (Lombok o manuales)
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }
    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }
    public String getCorreoElectronico() { return correoElectronico; }
    public void setCorreoElectronico(String correoElectronico) { this.correoElectronico = correoElectronico; }
    public String getCodigoPucp() { return codigoPucp; }
    public void setCodigoPucp(String codigoPucp) { this.codigoPucp = codigoPucp; }
    public Integer getCantidadTesistasActuales() { return cantidadTesistasActuales; }
    public void setCantidadTesistasActuales(Integer cantidadTesistasActuales) { this.cantidadTesistasActuales = cantidadTesistasActuales; }
    // public Integer getCapacidadMaxima() { return capacidadMaxima; }
    // public void setCapacidadMaxima(Integer capacidadMaxima) { this.capacidadMaxima = capacidadMaxima; }
    // public List<AreaTematicaDto> getAreasTematicas() { return areasTematicas; }
    // public void setAreasTematicas(List<AreaTematicaDto> areasTematicas) { this.areasTematicas = areasTematicas; }
    public String getUrlFoto() { return urlFoto; }
    public void setUrlFoto(String urlFoto) { this.urlFoto = urlFoto; }
}
