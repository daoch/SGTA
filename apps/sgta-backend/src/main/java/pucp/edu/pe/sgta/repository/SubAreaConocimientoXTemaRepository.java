package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.SubAreaConocimientoXTema;

import java.util.List;

@Repository
public interface SubAreaConocimientoXTemaRepository
		extends JpaRepository<SubAreaConocimientoXTema, SubAreaConocimientoXTema.SubAreaConocimientoXTemaId> {

	List<SubAreaConocimientoXTema> findByTemaIdAndActivoTrue(Integer temaId);

	SubAreaConocimientoXTema findFirstByTemaIdAndActivoTrue(Integer temaId);

}
