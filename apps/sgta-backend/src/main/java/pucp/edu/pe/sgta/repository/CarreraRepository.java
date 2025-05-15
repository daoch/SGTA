package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.model.Carrera;


import java.util.List;

public interface CarreraRepository extends JpaRepository<Carrera, Integer>{
    @Query(value = """
            select * from obtener_carreras_activas_por_usuario(
            :idAsesor
            )
            """,nativeQuery = true)
    List<Object[]> listarCarrerasPorIdUsusario(Integer idAsesor);

    @Query(
      value  = "SELECT * FROM obtener_carreras_por_usuario(:usuarioId)",
      nativeQuery = true
    )
    List<Carrera> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
}
