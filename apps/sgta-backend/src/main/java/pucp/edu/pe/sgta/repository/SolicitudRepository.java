package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.Solicitud;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
    List<Solicitud> findByTipoSolicitudId(Integer tipoSolicitudId);

    List<Solicitud> findByTipoSolicitudNombre(String tipoSolicitudNombre);

    Optional<Solicitud> findById(Integer id);

    @Query(value = "SELECT * FROM get_solicitudes_by_tema(:input_tema_id, :offset_val, :limit_val)", nativeQuery = true)
    List<Object[]> findSolicitudesByTemaWithProcedure(@Param("input_tema_id") Integer temaId,
            @Param("offset_val") Integer offset,
            @Param("limit_val") Integer limit);

    @Query(value = "SELECT COUNT(*) FROM get_solicitudes_by_tema_count(:temaId)", nativeQuery = true)
    Integer countSolicitudesByTema(@Param("temaId") Integer temaId);
}
