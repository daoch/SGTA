package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.EnlaceUsuario;

import java.util.List;

@Repository
public interface EnlaceUsuarioRepository extends JpaRepository<EnlaceUsuario, Integer> {

    @Query(value = "select * from listar_enlaces_usuario(:usuarioId)", nativeQuery = true)
    List<Object[]> listarEnlacesParaPerfilPorUsuario(@Param("usuarioId") Integer usuarioId);
}
