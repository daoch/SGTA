package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.SubAreaConocimientoXTema;

import java.util.List;

@Repository
public interface SubAreaConocimientoXTemaRepository
        extends JpaRepository<SubAreaConocimientoXTema, SubAreaConocimientoXTema.SubAreaConocimientoXTemaId> {

    List<SubAreaConocimientoXTema> findByTemaIdAndActivoTrue(Integer temaId);
    SubAreaConocimientoXTema findFirstByTemaIdAndActivoTrue(Integer temaId);

    @Query(value = """
        SELECT sub_area_conocimiento_id
          FROM sub_area_conocimiento_tema
         WHERE tema_id = :temaId
           AND activo = true
        """, nativeQuery = true)
    List<Integer> findSubAreaIdsByTemaId(@Param("temaId") Integer temaId);
}
