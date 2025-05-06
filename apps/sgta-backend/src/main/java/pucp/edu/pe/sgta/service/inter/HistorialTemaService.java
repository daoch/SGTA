package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.HistorialTemaDto;

public interface HistorialTemaService {

    /**
     * Método para obtener el historial de un tema por su ID.
     *
     * @param idTema ID del tema.
     * @return Historial del tema.
     */
    HistorialTemaDto getHistorialTemaById(Integer idTema);

    /**
     * Método para obtener el historial de un tema por su ID y su estado.
     *
     * @param idTema ID del tema.
     * @param estado Estado del tema.
     * @return Historial del tema.
     */
    HistorialTemaDto getHistorialTemaByIdAndEstado(Integer idTema, String estado);
}
