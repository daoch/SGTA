package pucp.edu.pe.sgta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Tema;

@Repository
public interface TemaRepository extends JpaRepository<Tema, Integer> {

	@Query(value = """
			SELECT *
			  FROM listar_temas_por_usuario_rol_estado(
			    :uid,
			    :rol,
			    :est
			  )
			""", nativeQuery = true)
	List<Object[]> listarTemasPorUsuarioRolEstado(@Param("uid") Integer usuarioId, @Param("rol") String rolNombre,
			@Param("est") String estadoNombre);

	@Query(value = """
			SELECT *
			  FROM listar_usuarios_por_tema_y_rol(
			    :tid,
			    :rol
			  )
			""", nativeQuery = true)
	List<Object[]> listarUsuariosPorTemaYRol(@Param("tid") Integer temaId, @Param("rol") String rolNombre);

	@Query(value = """
			SELECT *
			  FROM listar_subareas_por_tema(:tid)
			""", nativeQuery = true)
	List<Object[]> listarSubAreasPorTema(@Param("tid") Integer temaId);

	@Query(value = """
			SELECT *
			  FROM obtener_temas_usuario_asesor(:id)
			""", nativeQuery = true)
	List<Object[]> listarTemasAsesorInvolucrado(@Param("id") Integer asesorId);

	@Query(value = """
			  SELECT * FROM  listar_temas_ciclo_actual_x_etapa_formativa(:efid)
			""", nativeQuery = true)
	List<Object[]> listarTemasCicloActualXEtapaFormativa(@Param("efid") Integer etapaFormativaId);

	Optional<Tema> findByTitulo(String titulo);

	@Query(value = "SELECT * FROM obtener_ciclo_etapa_por_tema(:temaId)", nativeQuery = true)
	List<Object[]> obtenerCicloEtapaPorTema(@Param("temaId") Integer temaId);

}