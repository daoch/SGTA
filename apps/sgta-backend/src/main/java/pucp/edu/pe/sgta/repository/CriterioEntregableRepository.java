package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;

import java.util.List;

@Repository
public interface CriterioEntregableRepository extends JpaRepository<CriterioEntregable, Integer> {
    /**
     * Ahora devolvemos directamente List<CriterioEntregableDto> usando JPQL.
     * El constructor que invoca es el de CriterioEntregableDto(id, nombre, notaMaxima, descripcion).
     */
    @Query("""
        SELECT new pucp.edu.pe.sgta.dto.CriterioEntregableDto(
          c.id, 
          c.nombre, 
          c.notaMaxima, 
          c.descripcion
        )
        FROM CriterioEntregable c
        WHERE c.entregable.id = :entregableId
          AND c.activo = true
       """)
    List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(@Param("entregableId") Integer entregableId);
    //void insertar_actualizar_revision_criterio_entregable(@Param("entregableId") Integer revision_criterio_entregable_id)
}