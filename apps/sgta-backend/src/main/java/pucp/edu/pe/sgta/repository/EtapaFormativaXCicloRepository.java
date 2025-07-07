package pucp.edu.pe.sgta.repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import org.springframework.stereotype.Repository;


@Repository
public interface EtapaFormativaXCicloRepository extends JpaRepository<EtapaFormativaXCiclo, Integer> {

    List<EtapaFormativaXCiclo> findAllByEtapaFormativa_Carrera_IdAndActivoTrue(Integer id);

    List<EtapaFormativaXCiclo> findAllByEtapaFormativa_Carrera_IdAndCiclo_IdAndActivoTrue(Integer id, Integer cicloId);

    // Método para verificar si ya existe una etapa formativa con el mismo etapaFormativaId y cicloId activa
    boolean existsByEtapaFormativa_IdAndCiclo_IdAndActivoTrue(Integer etapaFormativaId, Integer cicloId);

    // Método para obtener todas las etapas formativas por carrera
    //List<EtapaFormativaXCiclo> findAllBy_Carrera_IdAndActivoTrue(Integer id);

    @Query(value = "SELECT * FROM listar_etapas_formativas_x_ciclo_x_carrera(:carreraId)", nativeQuery = true)
    List<Object[]> listarEtapasFormativasXCicloXCarrera(Integer carreraId);

    @Query(value = "SELECT * FROM listar_etapa_formativa_x_ciclo_x_id(:etapaXCicloId)", nativeQuery = true)
    List<Object[]> getEtapaFormativaXCicloByEtapaId(Integer etapaXCicloId);

    @Query(value = "SELECT * FROM listar_etapas_formativas_x_ciclo_tesista(:usuarioId)", nativeQuery = true)
    List<Object[]> listarEtapasFormativasXCicloTesista(Integer usuarioId);

    // Método para paginación con filtros usando native query simplificado
    @Query(value = "SELECT efc.* FROM etapa_formativa_x_ciclo efc " +
           "INNER JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id " +
           "INNER JOIN ciclo c ON efc.ciclo_id = c.ciclo_id " +
           "WHERE ef.carrera_id = :carreraId " +
           "AND efc.activo = true " +
           "AND (:estado IS NULL OR efc.estado = :estado) " +
           "AND (:anio IS NULL OR c.anio = :anio) " +
           "AND (:semestre IS NULL OR c.semestre = :semestre) " +
           "AND (:search IS NULL OR LOWER(ef.nombre) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(c.anio::text) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(c.semestre) LIKE LOWER('%' || :search || '%')) " +
           "ORDER BY c.anio DESC, c.semestre DESC",
           countQuery = "SELECT COUNT(*) FROM etapa_formativa_x_ciclo efc " +
           "INNER JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id " +
           "INNER JOIN ciclo c ON efc.ciclo_id = c.ciclo_id " +
           "WHERE ef.carrera_id = :carreraId " +
           "AND efc.activo = true " +
           "AND (:estado IS NULL OR efc.estado = :estado) " +
           "AND (:anio IS NULL OR c.anio = :anio) " +
           "AND (:semestre IS NULL OR c.semestre = :semestre) " +
           "AND (:search IS NULL OR LOWER(ef.nombre) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(c.anio::text) LIKE LOWER('%' || :search || '%') " +
           "OR LOWER(c.semestre) LIKE LOWER('%' || :search || '%'))",
           nativeQuery = true)
    Page<EtapaFormativaXCiclo> findAllByCarreraIdWithFilters(
        @Param("carreraId") Integer carreraId,
        @Param("estado") String estado,
        @Param("search") String search,
        @Param("anio") Integer anio,
        @Param("semestre") String semestre,
        Pageable pageable
    );

}
