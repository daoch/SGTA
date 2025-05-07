package pucp.edu.pe.sgta.repository;

import java.util.List;

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
    List<Object[]> listarTemasPorUsuarioRolEstado(
        @Param("uid") Integer usuarioId,
        @Param("rol") String rolNombre,
        @Param("est") String estadoNombre
    );

    @Query(value = """
        SELECT *
          FROM listar_usuarios_por_tema_y_rol(
            :tid,
            :rol
          )
        """, nativeQuery = true)
    List<Object[]> listarUsuariosPorTemaYRol(
        @Param("tid") Integer temaId,
        @Param("rol") String rolNombre
    );

    @Query(value = """
        SELECT *
          FROM listar_subareas_por_tema(:tid)
        """, nativeQuery = true)
    List<Object[]> listarSubAreasPorTema(
        @Param("tid") Integer temaId
    );

    //Funcion para filtrar areas por tema , etapa formativa,ciclo actual, sub area de conocimiento y asesores o jurado
    @Query(value = """
        SELECT * FROM listar_temas_por_etapa_formativa_ciclo_actual_subarea_nombre_docente(
            :docente,
            :etapaFormativa, 
            :subAreaConocimiento)
            """, nativeQuery = true)
    List<Object[]> listarTemasPorEtapaCicloActualYSubareaYDocente(@Param("docente") String docente,
                                                   @Param("etapaFormativa") Integer etapaFormativa,
                                                   @Param("subAreaConocimiento") Integer subAreaConocimiento);
}