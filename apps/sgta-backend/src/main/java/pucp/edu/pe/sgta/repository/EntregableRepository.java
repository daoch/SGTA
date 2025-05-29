package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Entregable;

import java.util.List;

@Repository
public interface EntregableRepository extends JpaRepository<Entregable, Integer> {

    @Query(value = "SELECT * FROM listar_entregables_x_etapa_formativa_x_ciclo(:etapaFormativaXCicloId)", nativeQuery = true)
    List<Object[]> listarEntregablesXEtapaFormativaXCiclo(@Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId);

    @Query(value = "SELECT * FROM listar_entregables_con_envio_x_etapa_formativa_x_ciclo(:etapaFormativaXCicloId, :temaId)",
            nativeQuery = true
    )
    List<Object[]> listarEntregablesConEnvioXEtapaFormativaXCiclo(
        @Param("etapaFormativaXCicloId") Integer etapaFormativaXCicloId,
        @Param("temaId") Integer temaId
    );

    @Query(value = "SELECT * FROM obtener_entregables_alumno(:alumnoId)", nativeQuery = true)
    List<Object[]> listarEntregablesPorAlumno(@Param("alumnoId") Integer alumnoId);

    @Query(value = "SELECT entregar_entregable(:entregableId, :comentario, :estado)", nativeQuery = true)
    void entregarEntregable(@Param("entregableId") Integer entregableId,
                            @Param("comentario") String comentario,
                            @Param("estado") String estado);
}
