package pucp.edu.pe.sgta.service.inter;

public interface CognitoService {
    String registrarUsuarioEnCognito(String correo, String nombre, String grupo) throws Exception;
}
