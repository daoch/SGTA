package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXSubAreaConocimiento;

import java.util.List;

public interface UsuarioXSubAreaConocimientoRepository extends JpaRepository<UsuarioXSubAreaConocimiento, Integer> {

	List<UsuarioXSubAreaConocimiento> findAllByUsuario_IdAndActivoIsTrue(Integer id);

	@Query(value = "SELECT asignar_usuario_sub_areas(:usuarioId, cast(:listaIds as INTEGER[]))", nativeQuery = true)
	void asignarUsuarioSubAreas(@Param("usuarioId") Integer idUsuario, @Param("listaIds") String idsSubAreas);

	@Query(value = "SELECT desactivar_usuario_sub_areas(:usuarioId, cast(:listaIds as INTEGER[]))", nativeQuery = true)
	void desactivarUsuarioSubAreas(@Param("usuarioId") Integer idUsuario, @Param("listaIds") String idsSubAreas);

}
