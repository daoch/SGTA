package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.UsuarioXCarrera;

public interface UsuarioXCarreraRepository extends JpaRepository<UsuarioXCarrera, Integer> {

	List<UsuarioXCarrera> findByUsuarioIdAndActivoTrue(Integer usuarioId);

}
