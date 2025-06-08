package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.TemaSimilar;

/**
 * Repository para gestionar relaciones de similitud entre temas.
 */
@Repository
public interface TemaSimilarRepository extends JpaRepository<TemaSimilar, Integer> {

    /**
     * Busca todas las relaciones de similitud para un tema dado.
     */
    List<TemaSimilar> findByTema_Id(Integer temaId);

    /**
     * Busca todos los temas que tienen al tema dado como similar.
     */
    List<TemaSimilar> findByTemaRelacion_Id(Integer temaRelacionId);

    /**
     * Obtiene los N temas más similares ordenados por porcentaje descendente.
     */
    @Query(value = "SELECT * FROM tema_similar WHERE tema_id = :temaId AND activo = true ORDER BY porcentaje_similitud DESC LIMIT :limit", nativeQuery = true)
    List<TemaSimilar> findTopSimilarByTema(
        @Param("temaId") Integer temaId,
        @Param("limit") int limit
    );

    /**
     * Desactiva todas las relaciones de similitud para un tema.
     */
    @Query(value = "UPDATE tema_similar SET activo = false, fecha_modificacion = CURRENT_TIMESTAMP WHERE tema_id = :temaId", nativeQuery = true)
    void deactivateAllByTema(@Param("temaId") Integer temaId);

    List<TemaSimilar> findByTemaIdAndActivoTrue(Integer temaId);
}
