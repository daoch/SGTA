package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.util.EstadoRevision;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface RevisionDocumentoRepository extends JpaRepository<RevisionDocumento, Integer> {
    Optional<RevisionDocumento> findById(Integer revisionDocumentoId);

    List<RevisionDocumento> findByUsuarioId(Integer usuarioId);

    List<RevisionDocumento> findByVersionDocumentoId(Integer versionDocumentoId);

    @Query("SELECT rd FROM RevisionDocumento rd WHERE rd.estadoRevisionStr = :estado")
    List<RevisionDocumento> findByEstadoRevisionStr(@Param("estado") String estadoRevisionStr);

    default List<RevisionDocumento> findByEstadoRevision(EstadoRevision estadoRevision) {
        return findByEstadoRevisionStr(estadoRevision.name().toLowerCase());
    }

    List<RevisionDocumento> findByVersionDocumentoDocumentoId(Integer documentoId);

    @Query(value = "SELECT * FROM listar_revisiones_por_documento(:documentoId)", nativeQuery = true)
    List<Object[]> listarRevisionesPorDocumento(@Param("documentoId") Integer documentoId);

    /**
     * Consulta para obtener todas las revisiones con la información completa para
     * el endpoint
     * Devuelve los datos necesarios para construir el DTO RevisionDto
     * Esta consulta usa CAST para asegurar compatibilidad con los tipos de datos
     * existentes
     */
    @Query(value = """
                SELECT
                    rd.revision_documento_id,
                    est.usuario_id as estudiante_id,
                    est.nombres as estudiante_nombres,
                    est.primer_apellido as estudiante_primer_apellido,
                    est.segundo_apellido as estudiante_segundo_apellido,
                    est.codigo_pucp as estudiante_codigo,
                    rev.usuario_id as revisor_id,
                    rev.nombres as revisor_nombres,
                    rev.primer_apellido as revisor_primer_apellido,
                    rev.segundo_apellido as revisor_segundo_apellido,
                    rev.codigo_pucp as revisor_codigo,
                    t.titulo,
                    t.tema_id,
                    vd.version_documento_id,
                    d.documento_id,
                    d.nombre_documento,
                    vd.fecha_ultima_subida as fecha_entrega,
                    rd.fecha_limite_revision,
                    rd.fecha_revision,
                    rd.estado_revision::TEXT,
                    rd.link_archivo_revision,
                    ext.fecha_envio,
                    e.fecha_fin,
                    ef.nombre as curso,
                    ef.etapa_formativa_id,
                    (SELECT COUNT(*) FROM observacion o WHERE o.revision_id = rd.revision_documento_id AND o.activo = true) as num_observaciones
                FROM
                    revision_documento rd
                    JOIN version_documento vd ON rd.version_documento_id = vd.version_documento_id
                    JOIN documento d ON vd.documento_id = d.documento_id
                    JOIN usuario rev ON rd.usuario_id = rev.usuario_id
                    JOIN usuario_documento ud ON ud.documento_id = d.documento_id
                    JOIN usuario est ON ud.usuario_id = est.usuario_id
                    JOIN tipo_usuario tu_est ON est.tipo_usuario_id = tu_est.tipo_usuario_id
                    LEFT JOIN usuario_tema ut ON ut.usuario_id = est.usuario_id
                    LEFT JOIN tema t ON ut.tema_id = t.tema_id
                    LEFT JOIN entregable_x_tema ext ON ext.tema_id = t.tema_id
                    LEFT JOIN entregable e ON ext.entregable_id = e.entregable_id
                    LEFT JOIN etapa_formativa_x_ciclo efxc ON e.etapa_formativa_x_ciclo_id = efxc.etapa_formativa_x_ciclo_id
                    LEFT JOIN etapa_formativa ef ON efxc.etapa_formativa_id = ef.etapa_formativa_id
                WHERE
                    rd.activo = true
                    AND (tu_est.nombre ILIKE '%estudiante%' OR tu_est.nombre ILIKE '%alumno%')
                ORDER BY
                    rd.fecha_creacion DESC
            """, nativeQuery = true)
    List<Object[]> findAllRevisionesCompletas();

    @Query(value = """
                SELECT
                    rd.revision_documento_id,
                    est.usuario_id as estudiante_id,
                    est.nombres,
                    est.primer_apellido,
                    est.segundo_apellido,
                    est.codigo_pucp,
                    t.titulo,
                    t.tema_id,
                    vd.version_documento_id,
                    d.documento_id,
                    d.nombre_documento,
                    vd.fecha_ultima_subida as fecha_entrega,
                    rd.fecha_limite_revision,
                    rd.fecha_revision,
                    rd.estado_revision::TEXT,
                    rd.link_archivo_revision,
                    ext.fecha_envio,
                    e.fecha_fin,
                    ef.nombre as curso,
                    ef.etapa_formativa_id,
                    (SELECT COUNT(*) FROM observacion o WHERE o.revision_id = rd.revision_documento_id AND o.activo = true) as num_observaciones
                FROM
                    revision_documento rd
                    JOIN version_documento vd ON rd.version_documento_id = vd.version_documento_id
                    JOIN documento d ON vd.documento_id = d.documento_id
                    JOIN usuario_documento ud ON ud.documento_id = d.documento_id
                    JOIN usuario est ON ud.usuario_id = est.usuario_id
                    JOIN tipo_usuario tu_est ON est.tipo_usuario_id = tu_est.tipo_usuario_id
                    LEFT JOIN usuario_tema ut ON ut.usuario_id = est.usuario_id
                    LEFT JOIN tema t ON ut.tema_id = t.tema_id
                    LEFT JOIN entregable_x_tema ext ON ext.tema_id = t.tema_id
                    LEFT JOIN entregable e ON ext.entregable_id = e.entregable_id
                    LEFT JOIN etapa_formativa_x_ciclo efxc ON e.etapa_formativa_x_ciclo_id = efxc.etapa_formativa_x_ciclo_id
                    LEFT JOIN etapa_formativa ef ON efxc.etapa_formativa_id = ef.etapa_formativa_id
                WHERE
                    rd.usuario_id = :revisorId
                    AND rd.activo = true
                    AND (tu_est.nombre ILIKE '%estudiante%' OR tu_est.nombre ILIKE '%alumno%')
                ORDER BY
                    rd.fecha_creacion DESC
            """, nativeQuery = true)
    List<Object[]> findRevisionesByRevisorId(@Param("revisorId") Integer revisorId);

    @Query(value = "SELECT * FROM obtener_documentos_asesor(:asesorId)", nativeQuery = true)
    List<Object[]> listarRevisionDocumentosPorAsesor(@Param("asesorId") Integer asesorId);

    @Query(value = "SELECT * FROM obtener_documentos_revisor(:revisorId)", nativeQuery = true)
    List<Object[]> listarRevisionDocumentosPorRevisor(@Param("revisorId") Integer revisorId);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE revision_documento
            SET estado_revision = CAST(:nuevoEstado AS enum_estado_revision)
            WHERE version_documento_id = (
                SELECT version_documento_id
                FROM revision_documento
                WHERE revision_documento_id = :revisionId
            )
            """, nativeQuery = true)
    void actualizarEstadoRevisionConCast(@Param("revisionId") Integer revisionId,
            @Param("nuevoEstado") String nuevoEstado);

    @Query(value = "SELECT * FROM obtener_revision_documento_por_id(:revision_id_input)", nativeQuery = true)
    List<Object[]> obtenerRevisionDocumentoPorId(@Param("revision_id_input") Integer revision_id_input);

    @Transactional
    @Query(value = "SELECT crear_revisiones(:entregableXTemaId)", nativeQuery = true)
    void crearRevisiones(@Param("entregableXTemaId") Integer entregableXTemaId);

    @Transactional
    @Query(value = "SELECT crear_revisiones_revisores(:entregableXTemaId)", nativeQuery = true)
    void crearRevisionesRevisores(@Param("entregableXTemaId") Integer entregableXTemaId);

    @Query(value = "SELECT crear_revisiones_jurado(:entregableXTemaId)", nativeQuery = true)
    void crearRevisionesJurado(@Param("entregableXTemaId") Integer entregableXTemaId);

    @Query(value = "SELECT * FROM obtener_alumnos_por_revision(:revision_id)", nativeQuery = true)
    List<Object[]> getStudentsByRevisor(@Param("revision_id") Integer revision_id);

    Optional<RevisionDocumento> findTopByVersionDocumento_IdOrderByFechaCreacionDesc(Integer versionDocumentoId);

    @Query("SELECT rd FROM RevisionDocumento rd WHERE rd.versionDocumento.entregableXTema.tema.id = :temaId AND rd.usuario.id = :asesorId AND rd.activo = true")
    List<RevisionDocumento> findByTemaIdAndAsesorId(@Param("temaId") Integer temaId,
            @Param("asesorId") Integer asesorId);

    @Query(value = "SELECT * FROM obtener_documentos_jurado(:juradoId)", nativeQuery = true)
    List<Object[]> listarRevisionDocumentosPorJurado(@Param("juradoId") Integer juradoId);
    
    @Procedure(procedureName = "actualizar_estado_revision_todos")
    void actualizarEstadoTodosRevisiones(Integer p_revision_id, String p_nuevo_estado);
    @Query(value = """
    SELECT
        u.usuario_id AS usuarioId,
        u.nombres AS nombres,
        u.primer_apellido AS primerApellido,
        u.segundo_apellido AS segundoApellido,
        ut.rol_id AS rolId,
        ut.tema_id AS temaId
    FROM
        usuario_tema ut
        JOIN usuario u ON u.usuario_id = ut.usuario_id
    WHERE
        ut.tema_id = :temaId
        AND ut.asignado = true
        AND ut.rechazado = false
        AND ut.activo = true
        AND u.activo = true
""", nativeQuery = true)
List<Object[]> listarRevisoresYJuradosPorTemaId(@Param("temaId") Integer temaId);

 @Transactional
    @Query(value = "SELECT asignar_revision_jurado(:temaId, :usuarioId)", nativeQuery = true)
    void asignarRevisionJurado(@Param("temaId") Integer temaId, @Param("usuarioId") Integer usuarioId);
    
    }
