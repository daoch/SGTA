package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pucp.edu.pe.sgta.model.Carrera;

import java.util.List;

public interface CarreraRepository extends JpaRepository<Carrera, Integer> {
        @Query(value = """
                        select * from obtener_carreras_activas_por_usuario(
                        :idAsesor
                        )
                        """, nativeQuery = true)
        List<Object[]> listarCarrerasPorIdUsusario(Integer idAsesor);

        @Query(value = "SELECT * FROM obtener_carreras_por_usuario(:usuarioId)", nativeQuery = true)
        List<Carrera> findByUsuarioId(@Param("usuarioId") Integer usuarioId);

        @Query(value = "select * from obtener_id_carrera_por_id_expo(:idExpo)", nativeQuery = true)
        Integer obtenerIdCarreraPorIdExpo(@Param("idExpo") Integer idExpo);

        @Query(value = "select * from obtener_carrera_coordinador(:usuarioId)", nativeQuery = true)
        List<Object[]> obtenerCarreraCoordinador(@Param("usuarioId") Integer usuarioId);

        @Query(value = "select * from obtener_carrera_alumno(:usuarioId)", nativeQuery = true)
        List<Object[]> obtenerCarreraAlumno(@Param("usuarioId") Integer usuarioId);
}
