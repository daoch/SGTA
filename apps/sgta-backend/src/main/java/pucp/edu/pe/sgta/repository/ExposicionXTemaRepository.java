package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.model.ExposicionXTema;

import java.util.List;

public interface ExposicionXTemaRepository extends JpaRepository<ExposicionXTema, Integer> {
    List<ExposicionXTema> findByTemaIdAndActivoTrue(Integer temaId);

    @Modifying
    @Query(value = "CALL llenar_exposicion_x_tema(:idexpo)", nativeQuery = true)
    void createAllRelatedByExposicionId(@Param("idexpo") Integer exposicionId);
}