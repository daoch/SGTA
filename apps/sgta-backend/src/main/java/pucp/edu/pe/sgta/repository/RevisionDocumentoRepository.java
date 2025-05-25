package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.util.EstadoRevision;

import java.util.List;

@Repository
public interface RevisionDocumentoRepository extends JpaRepository<RevisionDocumento, Integer> {

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
	 * Consulta para obtener todas las revisiones con la información completa para el
	 * endpoint Devuelve los datos necesarios para construir el DTO RevisionDto Esta
	 * consulta usa CAST para asegurar compatibilidad con los tipos de datos existentes
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
			""",
			nativeQuery = true)
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
			""",
			nativeQuery = true)
	List<Object[]> findRevisionesByRevisorId(@Param("revisorId") Integer revisorId);

}