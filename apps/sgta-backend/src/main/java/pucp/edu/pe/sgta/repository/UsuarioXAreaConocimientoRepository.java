package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXAreaConocimiento;

import java.util.List;

public interface UsuarioXAreaConocimientoRepository extends JpaRepository<UsuarioXAreaConocimiento, Integer> {

	List<UsuarioXAreaConocimiento> findAllByUsuario_IdAndActivoIsTrue(Integer id);

	@Query(value = "SELECT asignar_usuario_areas(:usuarioId, cast(:listaIds as INTEGER[]))", nativeQuery = true)
	void asignarUsuarioAreas(@Param("usuarioId") Integer idUsuario, @Param("listaIds") String idsAreas);

	@Query(value = "SELECT desactivar_usuario_areas(:usuarioId, cast(:listaIds as INTEGER[]))", nativeQuery = true)
	void desactivarUsuarioAreas(@Param("usuarioId") Integer idUsuario, @Param("listaIds") String idsAreas);

}
