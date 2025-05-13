package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Proyecto;

import java.util.List;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {
    @Query(value = "SELECT * FROM obtener_proyectos_usuario_involucrado(:usuarioId)", nativeQuery = true)
    List<Object[]> listarProyectosUsuarioInvolucrado(@Param("usuarioId") Integer usuarioId);
}
