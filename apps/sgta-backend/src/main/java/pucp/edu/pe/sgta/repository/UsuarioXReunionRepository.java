package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.UsuarioXReunion;

@Repository
public interface UsuarioXReunionRepository extends JpaRepository<UsuarioXReunion, Integer> {
    List<UsuarioXReunion> findByUsuarioIdAndActivoTrue(Integer usuarioId);
}