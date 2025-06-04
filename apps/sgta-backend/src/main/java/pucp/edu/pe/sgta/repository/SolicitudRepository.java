package pucp.edu.pe.sgta.repository; // Asegúrate que el paquete sea el correcto

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // <<--- IMPORTAR ESTO
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.*; // Importa tus entidades necesarias
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TipoSolicitud;
import pucp.edu.pe.sgta.model.Usuario;

import java.util.List;
import java.util.Optional;
// Eliminar import javax.swing.text.html.Option; si no se usa

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer>, JpaSpecificationExecutor<Solicitud> { // <<--- AÑADIR JpaSpecificationExecutor

    // Métodos existentes que ya tenías
    List<Solicitud> findByTipoSolicitudId(Integer tipoSolicitudId);
    List<Solicitud> findByTipoSolicitudNombre(String tipoSolicitudNombre);

    // Para el listado del coordinador (cuando SÍ filtras por estado)
    @Query("SELECT s FROM Solicitud s JOIN s.tema t JOIN t.carrera c JOIN s.tipoSolicitud ts JOIN s.estadoSolicitud es " +
            "WHERE c.id IN :carreraIds AND ts.nombre = :tipoSolicitudNombre AND s.activo = true AND es.nombre IN :targetStatusNames")
    Page<Solicitud> findConFiltroEstado(
            @Param("carreraIds") List<Integer> carreraIds,
            @Param("tipoSolicitudNombre") String tipoSolicitudNombre,
            @Param("targetStatusNames") List<String> targetStatusNames,
            Pageable pageable
    );

    // Para el listado del coordinador (cuando NO filtras por estado)
    @Query("SELECT s FROM Solicitud s JOIN s.tema t JOIN t.carrera c JOIN s.tipoSolicitud ts " +
            "WHERE c.id IN :carreraIds AND ts.nombre = :tipoSolicitudNombre AND s.activo = true")
    Page<Solicitud> findSinFiltroEstado(
            @Param("carreraIds") List<Integer> carreraIds,
            @Param("tipoSolicitudNombre") String tipoSolicitudNombre,
            Pageable pageable
    );

    // JpaRepository ya provee findById(Integer id) que devuelve Optional<Solicitud>,
    // por lo que no necesitas redefinirlo explícitamente a menos que quieras un comportamiento diferente.
    // Optional<Solicitud> findById(Integer id);

    // Métodos con nativeQuery (ya los tenías)
    @Query(value = "SELECT * FROM get_solicitudes_by_tema(:input_tema_id, :offset_val, :limit_val)", nativeQuery = true)
    List<Object[]> findSolicitudesByTemaWithProcedure(@Param("input_tema_id") Integer temaId,
                                                      @Param("offset_val") Integer offset,
                                                      @Param("limit_val") Integer limit);

    @Query(value = "SELECT COUNT(*) FROM get_solicitudes_by_tema_count(:temaId)", nativeQuery = true)
    Integer countSolicitudesByTema(@Param("temaId") Integer temaId);

    // Este parece un método específico, mantenlo si lo usas
    Optional<Solicitud> findByTipoSolicitudNombreAndTemaIdAndActivoTrue(String tipoSolicitudNombre, Integer temaId);

    // Para verificar si ya existe una solicitud PENDIENTE para un tema y tipo (usado al crear solicitud de cese)
    List<Solicitud> findByTemaAndTipoSolicitudAndEstadoSolicitudAndActivoTrue(
            Tema tema,
            TipoSolicitud tipoSolicitud,
            EstadoSolicitud estadoSolicitud
    );

    // Para buscar las invitaciones pendientes para un asesor (usado para la lista del Asesor B)
    Page<Solicitud> findByAsesorPropuestoReasignacionAndEstadoReasignacionAndActivoTrue(
            Usuario asesorPropuestoReasignacion,
            String estadoReasignacion,
            Pageable pageable
    );

    // Puedes añadir más métodos personalizados según necesites.
}