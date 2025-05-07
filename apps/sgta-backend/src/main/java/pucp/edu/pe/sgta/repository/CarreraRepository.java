package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pucp.edu.pe.sgta.model.Carrera;

import java.util.List;

public interface CarreraRepository extends JpaRepository<Carrera, Integer> {
    @Query(value = """
            select * from obtener_carreras_activas_por_usuario(
            :idAsesor
            )
            """,nativeQuery = true)
    List<Object[]> listarCarrerasPorIdUsusario(Integer idAsesor);
}
