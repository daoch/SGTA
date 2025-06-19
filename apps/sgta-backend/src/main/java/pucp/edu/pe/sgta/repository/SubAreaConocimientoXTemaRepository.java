package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.model.SubAreaConocimientoXTema;

import java.util.List;
import java.util.Set;

@Repository
public interface SubAreaConocimientoXTemaRepository
        extends JpaRepository<SubAreaConocimientoXTema, SubAreaConocimientoXTema.SubAreaConocimientoXTemaId> {

    List<SubAreaConocimientoXTema> findByTemaIdAndActivoTrue(Integer temaId);
    SubAreaConocimientoXTema findFirstByTemaIdAndActivoTrue(Integer temaId);


    List<SubAreaConocimientoXTema> findBySubAreaConocimiento_IdIn(Set<Integer> subAreaIds);
}
