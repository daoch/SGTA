package pucp.edu.pe.sgta.dto.asesores;

public class EstudianteSimpleDto {
    private Integer id;
    private String nombres;
    private String primerApellido;
    private String segundoApellido; // Opcional

    public EstudianteSimpleDto(Integer id, String nombres, String primerApellido, String segundoApellido) {
        this.id = id;
        this.nombres = nombres;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
    }
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }
    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }
}
