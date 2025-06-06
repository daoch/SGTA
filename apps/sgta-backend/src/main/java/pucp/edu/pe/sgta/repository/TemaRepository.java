package pucp.edu.pe.sgta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import pucp.edu.pe.sgta.model.Tema;

@Repository
public interface TemaRepository extends JpaRepository<Tema, Integer> {
  @Query(value = """
      SELECT *
        FROM listar_temas_por_usuario_rol_estado(
          :uid,
          :rol,
          :est,
          :limit,
          :offset
        )
      """, nativeQuery = true)
  List<Object[]> listarTemasPorUsuarioRolEstado(
      @Param("uid") Integer usuarioId,
      @Param("rol") String rolNombre,
      @Param("est") String estadoNombre,
      @Param("limit") Integer limit,
      @Param("offset") Integer offset);

  @Query(value = """
      SELECT *
        FROM listar_usuarios_por_tema_y_rol(
          :tid,
          :rol
        )
      """, nativeQuery = true)
  List<Object[]> listarUsuariosPorTemaYRol(
      @Param("tid") Integer temaId,
      @Param("rol") String rolNombre);

  @Query(value = """
      SELECT *
        FROM listar_subareas_por_tema(:tid)
      """, nativeQuery = true)
  List<Object[]> listarSubAreasPorTema(
      @Param("tid") Integer temaId);

  @Query(value = """
      SELECT *
        FROM obtener_temas_usuario_asesor(:id)
      """, nativeQuery = true)
  List<Object[]> listarTemasAsesorInvolucrado(
      @Param("id") Integer asesorId);

  @Query(value = """
        SELECT * FROM  listar_temas_ciclo_actual_x_etapa_formativa(:etapa_id,:expo_id)
      """, nativeQuery = true)
  List<Object[]> listarTemasCicloActualXEtapaFormativa(
      @Param("etapa_id") Integer etapaFormativaId,
      @Param("expo_id") Integer expoId
    );
    
    Optional<Tema> findByTitulo(String titulo);

  @Query(value = "SELECT * FROM obtener_ciclo_etapa_por_tema(:temaId)", nativeQuery = true)
  List<Object[]> obtenerCicloEtapaPorTema(@Param("temaId") Integer temaId);

  @Modifying
  @Transactional
  @Query(
    value = "CALL actualizar_estado_tema(:temaId, :nuevoEstado)",
    nativeQuery = true
  )
  void actualizarEstadoTema(
      @Param("temaId") Integer temaId,
      @Param("nuevoEstado") String nuevoEstado
  );
  
  @Procedure(procedureName = "desactivar_tema_y_desasignar_usuarios")
  void desactivarTemaYDesasignarUsuarios(
    @Param("p_tema_id") Integer temaId
  );

  @Query(value = """
        SELECT * FROM validar_tema_existe_cambiar_asesor_posible(:temaId)
""", nativeQuery = true)
  List<Object[]> validarTemaExisteYSePuedeCambiarAsesor(
          @Param("temaId") Integer temaId
  );

  @Query(value = "SELECT * FROM listar_temas_por_asociar_por_carrera(:carreraId)", nativeQuery = true)
  List<Object[]> listarTemasPorAsociarPorCarrera(@Param("carreraId") Integer carreraId);

  @Query(value = "SELECT asociar_tema_a_curso(:cursoId, :temaId)", nativeQuery = true)
  void asociarTemaACurso(@Param("cursoId") Integer cursoId,@Param("temaId") Integer temaId);

}