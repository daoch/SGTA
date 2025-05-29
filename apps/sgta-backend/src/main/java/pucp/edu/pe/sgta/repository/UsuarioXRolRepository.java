package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.UsuarioXRol;

import java.util.Collection;
import java.util.List;

public interface UsuarioXRolRepository extends JpaRepository<UsuarioXRol, Integer> {
    List<UsuarioXRol> findByUsuarioIdIn(Collection<Integer> ids);
}
