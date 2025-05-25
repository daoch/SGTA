package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sgta.model.ControlExposicionUsuarioTema;

import java.util.Optional;

public interface ControlExposicionUsuarioTemaRepository extends JpaRepository<ControlExposicionUsuarioTema, Integer> {
    Optional<ControlExposicionUsuarioTema> findByExposicionXTema_IdAndUsuario_Id(Integer exposicionXTemaId, Integer usuarioXTemaId);
}
