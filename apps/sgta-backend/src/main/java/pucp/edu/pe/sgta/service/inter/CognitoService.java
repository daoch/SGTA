package pucp.edu.pe.sgta.service.inter;

public interface CognitoService {
    String registrarUsuarioEnCognito(String correo, String nombre, String grupo) throws Exception;
    public void eliminarUsuarioEnCognito(String idCognito) throws Exception;
    public void updateUsuarioEnCognito(String idCognito, String grupoAnterior, String grupoNuevo, String nuevoCorreo);
}
