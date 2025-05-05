package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXSubAreaConocimiento;

import java.util.List;

public interface UsuarioXSubAreaConocimientoRepository extends JpaRepository<UsuarioXSubAreaConocimiento, Integer> {
    List<UsuarioXSubAreaConocimiento> findAllByUsuario_IdAndActivo(Integer id);
}
