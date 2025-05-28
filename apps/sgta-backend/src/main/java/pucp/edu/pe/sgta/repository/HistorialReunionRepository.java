package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface HistorialReunionRepository extends JpaRepository<Usuario, Integer> {
    @Query(value = "SELECT t.fecha, t.duracion, t.notas " +
           "FROM listar_historial_reuniones_por_tesista(:tesistaId) t", nativeQuery = true)
    List<Object[]> getHistorialReuniones(@Param("tesistaId") Integer tesistaId);
} 