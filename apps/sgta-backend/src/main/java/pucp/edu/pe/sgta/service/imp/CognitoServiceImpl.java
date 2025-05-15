package pucp.edu.pe.sgta.service.imp;

import pucp.edu.pe.sgta.service.inter.CognitoService;

public class CognitoServiceImpl implements CognitoService {
    @Override
    public void registrarUsuarioEnCognito(String correo, String nombre, String grupo) throws Exception {
        System.out.printf("Simulando registro de usuario: %s (%s) en el grupo %s\n", nombre, correo, grupo);
    }
}
