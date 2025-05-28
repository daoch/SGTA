package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.UsuarioXCarrera;

public interface UsuarioXCarreraRepository extends JpaRepository<UsuarioXCarrera, Integer>{
    List<UsuarioXCarrera> findByUsuarioIdAndActivoTrue(Integer usuarioId);
    List<UsuarioXCarrera> findByCarreraIdAndActivoTrue(Integer carreraId);
    boolean existsByUsuarioIdAndCarreraIdAndActivo(
                Integer usuarioId,
                Integer carreraId,
                Boolean activo
    );
}
