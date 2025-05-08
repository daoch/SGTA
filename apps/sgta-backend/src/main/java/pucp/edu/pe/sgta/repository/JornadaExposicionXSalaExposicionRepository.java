package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;

public interface JornadaExposicionXSalaExposicionRepository
        extends JpaRepository<JornadaExposicionXSalaExposicion, Integer> {

         @Query(value = """
        SELECT *
          FROM listar_jornadas_exposicion_salas(
            :etapa_formativa_id)
        """, nativeQuery = true)
    List<Object[]> listarJornadasExposicionSalas(
            @Param("etapa_formativa_id") Integer etapa_formativa_id
    );
}
