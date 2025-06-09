package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface ReunionService {

    // Listar todas las reuniones activas
    List<Reunion> findAll();

    // Buscar reunión por ID
    Optional<Reunion> findById(Integer id);

    // Listar reuniones ordenadas por fecha
    List<Reunion> findAllOrderedByDate();

    // Guardar o actualizar una reunión
    Reunion save(Reunion reunion);

    // Actualizar una reunión existente
    Reunion update(Integer id, Reunion reunionActualizada) throws Exception;

    // Eliminar una reunión
    void delete(Integer id) throws Exception;

    // guardar con usuarios, usa la firma de ReunionServiceImpl: public Reunion guardarConUsuarios(Reunion reunion, List<Usuario> usuarios) {
    Reunion guardarConUsuarios(Reunion reunion, List<Usuario> usuarios) throws Exception;
}