package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.UsuarioXTema;

import java.util.List;

@Repository
public interface UsuarioXTemaRepository extends JpaRepository<UsuarioXTema, Integer> {
    List<UsuarioXTema> findByUsuarioIdAndActivoTrue(Integer usuarioId);

}
