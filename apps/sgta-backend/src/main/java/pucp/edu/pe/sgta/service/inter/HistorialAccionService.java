package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.HistorialAccion;
import java.util.List;

public interface HistorialAccionService {

    /**
     * Registra una nueva entrada en el historial.
     *
     * @param idCognito  el identificador del usuario (p. e. cognito)
     * @param accion     la descripción de la acción realizada
     */
    void registrarAccion(String idCognito, String accion);

}