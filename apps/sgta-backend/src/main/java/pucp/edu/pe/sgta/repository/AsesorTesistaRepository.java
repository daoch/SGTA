package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.UsuarioXTema;

import java.util.List;

@Repository
public interface AsesorTesistaRepository extends JpaRepository<UsuarioXTema, Integer> {

    @Query(value = """

            SELECT
            a_user.usuario_id as asesor_id,
            a_user.nombres as asesor_nombre,
            a_user.correo_electronico as asesor_email,
            t_user.usuario_id as tesista_id,
            t_user.nombres as tesista_nombre,
            t_user.correo_electronico as tesista_email,
            ef.etapa_formativa_id as etapa_formativa_id,
            ef.nombre as etapa_formativa_nombre
        FROM usuario_tema asesor
        JOIN usuario_tema tesista ON asesor.tema_id = tesista.tema_id
        JOIN usuario_rol asesor_rol ON asesor.usuario_id = asesor_rol.usuario_id
        JOIN usuario_rol tesista_rol ON tesista.usuario_id = tesista_rol.usuario_id
        JOIN usuario AS a_user ON asesor.usuario_id = a_user.usuario_id
        JOIN usuario AS t_user ON tesista.usuario_id = t_user.usuario_id
        JOIN usuario_carrera uc ON asesor.usuario_id = uc.usuario_id
        JOIN carrera c ON uc.carrera_id = c.carrera_id
        JOIN etapa_formativa_x_ciclo_x_tema efct ON asesor.tema_id = efct.tema_id
        JOIN etapa_formativa_x_ciclo efc ON efct.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
        JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
        WHERE asesor_rol.rol_id = 1
        AND tesista_rol.rol_id = 4
        AND asesor.usuario_id != tesista.usuario_id
        AND LOWER(c.nombre) LIKE LOWER('%' || :carrera || '%');
        """, nativeQuery = true)
    List<Object[]> findAsesorTesistaByCarrera(@Param("carrera") String carrera);

    @Query(value = "SELECT * FROM listar_tesistas_por_asesor(:usuarioId)", nativeQuery = true)
    List<Object[]> listarTesistasXAsesor(@Param("usuarioId") Integer usuarioId);
}