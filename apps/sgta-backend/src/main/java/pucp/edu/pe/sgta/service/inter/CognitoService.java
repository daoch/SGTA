package pucp.edu.pe.sgta.service.inter;

public interface CognitoService {
    void registrarUsuarioEnCognito(String correo, String nombre, String grupo) throws Exception;
}
